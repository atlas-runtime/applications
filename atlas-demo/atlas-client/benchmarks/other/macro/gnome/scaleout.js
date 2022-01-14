/* benchmark specific */
import {GnomeSort_bench as GnomeSort_asd} from './benchmarks/micro/Sorts/GnomeSort.js'
let GnomeSort_bench = wrapper(GnomeSort_asd)
globalThis.buffer_size = 2500
/* global inits */
demo_setup()
atlas_wrapper.start_streaming()
atlas_wrapper.warmup_system(GnomeSort_bench, [buffer_size])
atlas_wrapper.warmup_done().then(function(val) {
    scaleout_traffic(GnomeSort_bench, buffer_size)
});
