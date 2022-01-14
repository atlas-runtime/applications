/* benchmark specific */
import {EditDistance_bench} from './benchmarks/micro/Dynamic-Programming/EditDistance.js'
let E1 = wrapper(EditDistance_bench)
globalThis.buffer_size = 2000
/* global inits */
demo_setup()
atlas_wrapper.start_streaming()
atlas_wrapper.warmup_system(E1, [buffer_size])
atlas_wrapper.warmup_done().then(function(val) {
    create_traffic(E1, [buffer_size])
});
