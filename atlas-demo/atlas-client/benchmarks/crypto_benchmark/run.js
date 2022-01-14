import {benchmarks} from 'benchmarks/crypto_benchmark/crypto-wrapper.js';
/*
 * Functionality for generating and scheduling packets on different intervals
 */
let promise_results = []
let step = 0
let last_step = 0;
function generate_traffic(func, ...args) {
    // calculate how many function we have received
    var received_func_count = atlas_get_received_function_count(func);
    os.setTimeout(function() {
        // print only when the interval switches, no reason to spam the stdio
        if (last_step !== step) {
            print("Pkt Received:", received_func_count);
            last_step = step;
        }
        if (local_execution === true)
            pkt_sent++;
        // resolve the promise
        promise_results.push(func(...args))
        generate_traffic(func, ...args);
    }, interval);

    // have we received 120 packets?
    if (received_func_count >= 120) {
        // gather all the results and print them
        Promise.allSettled(promise_results)
            .then(function(results) {
                // you might want to print this, but the output IS HUGE
                // var i = 0;
                // print the results for each request
                // results.forEach((result) => print('Pkt ID:', i++, "Result:", result.value));
                // complete execution and exit the program
                print("Execution completed, exiting...");
                std.exit(0);
            });
    }
    // interval switch algorithm
    if (pkt_sent < 10 && step == 0) {
        step = 1
        interval = 800;
    } else if (pkt_sent > 10 && pkt_sent < 25 && step == 1) {
        interval = 700;
        step = 2
    } else if (pkt_sent > 25 && pkt_sent < 55 && step == 2) {
        interval = 400;
        step = 3;
    } else if (pkt_sent > 55 && pkt_sent < 80 && step == 3) {
        interval = 200;
        step = 4
    } else if (pkt_sent > 80 && pkt_sent < 100 && step == 4) {
        interval = 500;
        step = 5
    } else if (pkt_sent > 100 && pkt_sent < 120 && step == 5) {
        interval = 900;
        step = 6
    }
}

let key = 'secret key 123'
// generate input
let input = ''
for (let i = 0; i < 10000; i++)
    input = input + 'a';
// start generating traffic
generate_traffic(benchmarks.encrypt_sign, input, key, key);
