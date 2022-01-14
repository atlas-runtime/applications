import {signal_exec} from 'benchmarks/macro/signal/cd.js'

function bench(n1, n2) {
    /* generate client contacts locally and offload */
    let client_users = gen_users(n2)
    let cd_manager = wrapper(signal_exec)
    /* generate dummy users for each SGX Node */
    atlas_wrapper.distribute_to_all_workers(cd_manager.bootstrap, [n1])
    //cd_manager.bootstrap(n1)
    //print(JSON.stringify(Array.from(client_users.entries())))
    cd_manager.check_users(stringify(client_users))
    cd_manager.check_users(stringify(client_users))
    //cd_manager.check_results()
    //cd_manager.check_results()
}

//atlas_wrapper.start_streaming()
bench(100000, 100)
//std.exit(1)
