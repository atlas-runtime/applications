/* benchmark specific */
import {pw_bootstrap as pw_bootstrap} from   'benchmarks/macro/simple-pw/CreateDB.js'
import {UpdateN_bench as UpdateN_bench} from 'benchmarks/macro/simple-pw/UpdateN.js'  
import {ReadN_bench as ReadN_bench} from     'benchmarks/macro/simple-pw/ReadN.js'        

let db_size = 10000
let operations = 1000000
let batch = 1000000
let cc = db_size
globalThis.buffer_size = operations
function db_batch_call (a, b, c) {
    UpdateN_bench(a, b, c)
    ReadN_bench(a, b, c)
}
let w = wrapper(db_batch_call)
/* global inits */
demo_setup()
atlas_wrapper.start_streaming()
/* distribute call */
atlas_wrapper.distribute_to_all_workers(pw_bootstrap, [db_size, operations, batch]);
/* when all dist calls are done, start warmup */
atlas_wrapper.dist_done().then(function(val) {
    /* when warmup is done, start read offloading */
    atlas_wrapper.warmup_system(w, [db_size, operations, batch])
    atlas_wrapper.warmup_done().then(function(val) {
        create_traffic(w, db_size, operations, batch)
    });
});
