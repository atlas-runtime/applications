/* benchmark specific */
import {DecisionTree_bench as dectree} from './benchmarks/macro/dectree/DecisionTree.js'
let input = 2000
globalThis.buffer_size = input
let DecisionTree_bench = wrapper(dectree)
/* Core */
demo_setup()
atlas_wrapper.start_streaming()
atlas_wrapper.warmup_system(DecisionTree_bench, [input])
atlas_wrapper.warmup_done().then(function(val) {
    scaleout_traffic(DecisionTree_bench, input)
});
