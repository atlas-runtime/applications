/* benchmark specific */
import {Kmeans_bench as Kmeans_asd} from './benchmarks/macro/kmeans/Kmeans.js'
let input = 2500
globalThis.buffer_size = input
let Kmeans_bench = wrapper(Kmeans_asd)
/* Core */
demo_setup()
atlas_wrapper.start_streaming()
atlas_wrapper.warmup_system(Kmeans_bench, [input])
atlas_wrapper.warmup_done().then(function(val) {
    create_traffic(Kmeans_bench, input)
});
