/* benchmark specific */
import {GnomeSort_bench} from './benchmarks/micro/Sorts/GnomeSort.js'
let G1 = wrapper(GnomeSort_bench)
globalThis.buffer_size = 2500
/* global inits */
demo_setup()
atlas_wrapper.start_streaming()
atlas_wrapper.warmup_system(G1, [buffer_size])
atlas_wrapper.warmup_done().then(function(val) {
    create_traffic(G1, [buffer_size])
});
