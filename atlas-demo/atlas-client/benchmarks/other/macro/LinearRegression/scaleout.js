/* benchmark specific */
import {LinearRegression_bench as LinearRegression} from './benchmarks/macro/LinearRegression/LinearRegression.js'
let input = 5000000
globalThis.buffer_size = input
let LinearRegression_bench = wrapper(LinearRegression)
/* Core */
demo_setup()
atlas_wrapper.start_streaming()
atlas_wrapper.warmup_system(LinearRegression_bench, [input])
atlas_wrapper.warmup_done().then(function(val) {
    scaleout_traffic(LinearRegression_bench, input)
});
