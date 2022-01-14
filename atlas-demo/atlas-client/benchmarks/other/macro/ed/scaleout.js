/* benchmark specific */
import {EditDistance_bench as EditDistance_asd} from './benchmarks/micro/Dynamic-Programming/EditDistance.js'
let EditDistance_bench = wrapper(EditDistance_asd)

globalThis.buffer_size = 2000
/* global inits */


/* global inits */
demo_setup()
atlas_wrapper.start_streaming()
atlas_wrapper.warmup_system(EditDistance_bench, [buffer_size])
atlas_wrapper.warmup_done().then(function(val) {
    scaleout_traffic(EditDistance_bench, buffer_size)
});
