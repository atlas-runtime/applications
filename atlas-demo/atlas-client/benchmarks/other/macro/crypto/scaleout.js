/* benchmark specific */
let CryptoJS = require("benchmarks/crypto/crypto-js")
if (local_execution == false) 
    CryptoJS = wrapper(CryptoJS)
globalThis.buffer_size = 500000
globalThis.input = atlas_tools.repeat('a', Number(globalThis.buffer_size));
function SHA512(input){
    CryptoJS.SHA512(input)
    CryptoJS.SHA512(input)
}
let b = wrapper(SHA512)
/* global inits */
demo_setup()
atlas_wrapper.start_streaming()
atlas_wrapper.warmup_system(b, [input])
atlas_wrapper.warmup_done().then(function(val) {
    scaleout_traffic(b, input)
});
