/* benchmark specific */
import {Dijkstra_bench as Dijkstra_asd} from './benchmarks/micro/Graphs/Dijkstra.js'
let Dijkstra_bench = wrapper(Dijkstra_asd)

globalThis.buffer_size = 10000
/* global inits */
demo_setup()
atlas_wrapper.start_streaming()
atlas_wrapper.warmup_system(Dijkstra_bench, [buffer_size])
atlas_wrapper.warmup_done().then(function(val) {
    create_traffic(Dijkstra_bench, buffer_size)
});
