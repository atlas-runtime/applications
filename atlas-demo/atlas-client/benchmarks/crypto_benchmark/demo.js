import {benchmarks} from 'benchmarks/crypto_benchmark/crypto-wrapper.js';
function gather() {
	//console.log(promise_results.length)
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
/*
 * Functionality for generating and scheduling packets on different intervals
 */
var last_step = 0
var step = 0
let promise_results = []
interval = 1;
function generate_traffic(func, ...args) {
	// calculate how many function we have received
	var received_func_count = atlas_get_received_function_count(func);
	// have we received 120 packets?
	if (pkt_sent > 9) {
		gather();
		return ;
	}
	os.setTimeout(function() {
		// print only when the interval switches, no reason to spam the stdio
		if (local_execution === true)
			pkt_sent++;
		// resolve the promise
		promise_results.push(func(...args))
		generate_traffic(func, ...args);
	}, interval);
}

if (globalThis.opts.input === undefined) {
	print("Please provide a file input using --input flag")
	std.exit(0)
}
let cmd = "cat " + globalThis.opts.input
var prog = std.popen(cmd, "r")
let r = prog.getline().split()
let key = 'secret key 123'
// generate input
// start generating traffic
generate_traffic(benchmarks.encrypt_sign, r.toString(), key, key)
