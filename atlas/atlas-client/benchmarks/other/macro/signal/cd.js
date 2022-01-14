/***************************************************************/
/* 1. The contact discovery service passes a batch of encrypted*/
/* contact discovery requests to the enclave.                  */
/* DONE by default in SGX with e2e encryption from client->node*/
/***************************************************************/


/*******************************************************************************/
/* 2. The enclave decrypts the requests and uses the oblivious hash table      */
/* construction process to build a hash table containing all submitted contacts*/
/* DONE by default in SGX with e2e encryption from client->node                */
/*******************************************************************************/
function arr_2_map(r) {
    let nm = new Map()
    for (let [k, v] of m) {
        nm.set(v[0], v[1])
    }
    return nm
}

function generate_number() {
    return Math.random().toString().slice(2, 8);
}

function gen_users(n) {
    let arr = new Map()
    for (let i = 0; i < n; i++) {
        let num = generate_number()
        arr.set(num, false)
    }
    return arr
}

function bootstrap (n1) {
    globalThis.registered_users = gen_users(n1)
    //let client_users = gen_users(n2)
    globalThis.client_results = new Map()
}

function generate_string(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
   }
   return result.join('');
}

/*******************************************************************************/
/* 3. The enclave iterates over the list of all registered users.              */
/* For each registered user, the enclave indexes into the hash                 */
/* table containing the batch of client contacts and does a constant-time      */
/* comparison against every contact in that cache line.                        */
/* 4. The enclave writes to the results cache line for that same hash          */
/* index, regardless of whether there was a successful compare or not.         */
/* 5. After iterating through the entire set of registered users, the enclave  */
/* builds an oblivious response list for each client request in the batch.     */
/*******************************************************************************/
function check_users(client_users) {
    client_users = Array.from(parse(client_users));//new Map(client_users)
    //client_results = arr_2_map(client_results)
    for (let [k,v] of registered_users) {
        for (let [k2,v2] of client_users) {
            /* do constant time comparison */
            if (k === k2) {
                /* write the results to the database */
                client_results.set(v.num, true)
            } else {
                /* perform equal writes to the database */
                client_results.set(v.num + 'x', false)
            }
        }
    }
    return check_results()
}

function check_results() {
    /* print */
    let p = new Map()
    for (let [k,v] of client_results) {
        if (v == true)
            p.set(k, JSON.stringify(v))
    }
    return stringify(Array.from(p.entries()))
}
/*******************************************************************************/
/* 6. The enclave encrypts the appropriate response list to each requesting    */
/* client, and returns the batch results to the service.                       */
/* 7. The service transmits the encrypted response back to each requesting client*/
/* Done automaticaly by the node code                                          */
/*******************************************************************************/
globalThis.gen_users = gen_users
let signal_exec = {}
signal_exec.bootstrap = bootstrap
signal_exec.gen_users = gen_users
signal_exec.check_users = check_users
signal_exec.check_results = check_results
export {signal_exec}
