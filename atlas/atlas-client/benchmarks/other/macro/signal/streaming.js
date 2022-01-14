/* benchmark specific */
import {signal_exec} from 'benchmarks/macro/signal/cd.js'
//import {stringify,parse} from './atlas-srl.js'
let cc = 100
let input = 40000
globalThis.buffer_size = cc
/* generate client contacts locally and offload */
let client_users = gen_users(cc)
let cd_manager = wrapper(signal_exec)
/* global inits */
demo_setup()
atlas_wrapper.start_streaming()
/* distribute call */
atlas_wrapper.distribute_to_all_workers(cd_manager.bootstrap, [input])
/* when all dist calls are done, start warmup */
atlas_wrapper.dist_done().then(function(val) {
    /* when warmup is done, start read offloading */
    atlas_wrapper.warmup_system(cd_manager.check_users, [stringify(client_users)])
    atlas_wrapper.warmup_done().then(function(val) {
        create_traffic(cd_manager.check_users, (stringify(client_users)))
    });
});
