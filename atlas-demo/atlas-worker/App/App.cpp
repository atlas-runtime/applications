#include <unistd.h>
#include <termios.h>
#include <sys/ioctl.h>
#include <sys/time.h>
#include <stdio.h>
#include "sgx_urts.h"
#include "Enclave_u.h"
#include "sgx_tcrypto.h"
#include "funcs.h"
#define ENCLAVE_FILE "enclave.signed.so"
#define STDC_WANT_LIB_EXT1 1
#include "../Enclave/dh/tools.h"
#include "../Enclave/dh/tweetnacl.h"
#include <errno.h>
#include <locale.h>
#include <dlfcn.h>
#include <time.h>
#include <sys/types.h>
#include <dirent.h>
#include <signal.h>
#include <sys/stat.h>
#include <sys/types.h>
#include "nw.h"
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/param.h>
#define _unused(x) ((void)(x))

double sgx_time = 0.0f;
double e2e_time = 0.0f;
double exec_time = 0.0f;
struct timespec te2e_start = {0, 0}, te2e_stop = {0, 0}, tsgx_start{0, 0}, tsgx_stop{0, 0}, 
                texec_start{0, 0}, texec_stop{0, 0};

void
ocall_print(uint8_t* value)
{
    int i;
    for(i = 0; i < 32; i++){
        printf("%2.2x", value[i]);
    }
}

long 
get_file_size(FILE *f)                                                
{                                                                     
    long size;                                                        
    fseek(f, 0, SEEK_END);                                            
    size = ftell(f);                                                  
    fseek(f, 0, SEEK_SET);                                            
    return size;                                                      
}                                                                     

void usage(){};

int
main(int argc, char *argv[])
{
    int32_t socket_fd, val_result, ws;
    int32_t updated;
    sgx_enclave_id_t eid;
    int port;
    unsigned char *buffer;
    char opt;
    int32_t buffer_len;
    uint8_t server_public_key[crypto_box_PUBLICKEYBYTES];
    uint8_t client_public_key[crypto_box_PUBLICKEYBYTES];
    memset(server_public_key, 0, crypto_box_PUBLICKEYBYTES);
    memset(client_public_key, 0, crypto_box_PUBLICKEYBYTES);
    sgx_status_t ret;
    sgx_launch_token_t token = {0};
    ret = SGX_SUCCESS;
    eid = 0;
    buffer_len = 0;
    port = 0;
    (void) ret;
    val_result = 0;
#ifdef DEBUG
    /* create the enclave */
    printf("Creating Enclave\n");
#endif
    /*
     * Get arguments
     */
    while ((opt = getopt(argc, argv, "p:h")) != -1) { 
        switch (opt) {
            case 'p':
                port = (short unsigned int)atoi(optarg);
                break;
            case 'h':
            default:
                usage();
        }
    }
    // create the enclave
    ret = sgx_create_enclave("enclave.signed.so", SGX_DEBUG_FLAG, &token,
            &updated, &eid, NULL);
    /* init the enclave args */
    ret = ecall_init(eid, stdin, stdout, stdout);
#ifdef DEBUG
    if (ret != SGX_SUCCESS){
        printf("\nERROR: failed to create enclave, code: %#x\n", ret);
        abort();
    }
#endif
    ret = ecall_get_server_key(eid, server_public_key, crypto_box_PUBLICKEYBYTES);
#ifdef DEBUG
    if (ret != SGX_SUCCESS){
        printf("\nERROR: failed to create enclave, code: %#x\n", ret);
        abort();
    }
#endif
    //check_args(daemon_port, local_execution, input_file);
    if (port != 0) {
            // listen to a socket
            ws = diencl_socket(port);
restart:
            // accept a client that ofloads requests
            socket_fd = diencl_accept(ws);
            memset(client_public_key, '\0', crypto_box_PUBLICKEYBYTES);
            // recv the clients public key
            val_result = recv_data(socket_fd, client_public_key, crypto_box_PUBLICKEYBYTES);
            if (val_result == -1) {
                close(socket_fd);
                goto restart;
            }
#ifdef DEBUG
            print_key("Client pkey", client_public_key, crypto_box_PUBLICKEYBYTES);
#endif
            // register the clients key
            ecall_register_client_key(eid, client_public_key, crypto_box_PUBLICKEYBYTES);
            // send the server public key
            ecall_send_pubkey(eid, socket_fd);
            // generate encryption key
            ecall_generate_shared_key(eid, socket_fd);
            // start receiving offlodaing requests
            while (read(socket_fd, &buffer_len, sizeof(uint32_t))) {
                buffer = (uint8_t *)calloc(buffer_len, sizeof(uint8_t));
                val_result = recv_data(socket_fd, buffer, buffer_len);
                // The client terminated, reset the socket
                if (val_result <= 0) {
                    close(socket_fd);
                    goto restart;
                }
                ecall_start(eid, socket_fd, buffer, buffer_len);
                buffer_len = 0;
                free(buffer);
            }
            close(socket_fd);
            goto restart;
    }
    // we should never go here
    sgx_destroy_enclave(eid);
}
