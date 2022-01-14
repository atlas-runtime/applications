import * as std from "std";
import * as os from "os";
import atlas_scheduler from './atlas-scheduler.js';
import * as atlas_wrapper from './atlas-wrapper.js';
import atlas_tools from './atlas-tools.js';
import {stringify, parse} from './atlas-srl.js';
import atlas_battery from './atlas-battery.js';
globalThis.os = os;
globalThis.std = std;
globalThis.atlas_tools = atlas_tools;
globalThis.stringify = stringify;
globalThis.parse = parse;
globalThis.file_to_exec = undefined;
globalThis.scaling = false;
globalThis.local_execution = false;
globalThis.interval = -1;
globalThis.wrapping_libs = false;
globalThis.log_name = undefined;
let number_of_servers = 0;
let number_of_workers = 0;

/*
 * the actual workers that currently can be used for scheduling
 */
globalThis.actual_workers = 1
/******************************/
/*     Setters and Getters    */
/******************************/
function get_server_count() {
    return number_of_servers;
}
function get_worker_count() {
    return number_of_workers;
}
function set_server_count(n) {
    number_of_servers = n
}
function set_worker_count(n) {
    number_of_workers = n
}

globalThis.get_server_count = get_server_count
globalThis.get_worker_count = get_worker_count
globalThis.set_server_count = set_server_count

function atlas_print(...str) {
    if (globalThis.log_name !== undefined) {
        var args = Array.prototype.slice.call(arguments);
        args.forEach(function(element) {
            log_file.printf("%s", element);
        }, this);
        log_file.printf("\n");
        log_file.flush();
    }
}

function usage() {
    print("Usage: quickjs daemon.js --log --servers x --file input.js\n" +
        "flags:\n" +
        "servers     \t Number of atlas node to use\n" + 
        "file        \t The source code to execute\n" +
        "server_file \t The file that contains the atlas nodes with ips\n" + 
        "log         \t Write atlas execution logs to file\n" + 
        "help        \t Show this usage message");
    std.exit(1)
}

function evaluate_args(opts) {
    if (opts["file"] !== undefined) {
	    globalThis.file_to_exec = opts["file"]
    } else {
        print("Failed to provide the executable file, exiting")
        usage();
    }
    if (opts.hasOwnProperty("local")) {
        globalThis.local_execution = true
    } else {
        if (opts["servers"] === undefined) {
            print("Set number of servers")
            usage()
        }
        set_worker_count(parseInt(opts["servers"]))
        set_server_count(parseInt(opts["servers"]))
        if (opts.hasOwnProperty("scaling")) {
            globalThis.scaling = true
        } else {
            // since we are not using scaling, use all the workers without the local
            actual_workers = get_worker_count()
        }
        if (opts["server_file"] !== undefined)
            globalThis.server_file = opts["server_file"]
        else
            globalThis.server_file = "./atlas-addresses.txt"
    }
    if (opts["log"] !== undefined) {
        globalThis.log_name = opts["log"];
        globalThis.log_file = std.open(globalThis.log_name, 'w');
    }
    //if (get_worker_count() != get_server_count() && local_execution == false) {
    //    print("Error, set more servers");
    //    usage();
    //}
}
// parse the user arguments
const opts = atlas_tools.parse_args(scriptArgs)
globalThis.opts = opts
// evaluate the arguments
evaluate_args(opts)
// start the ticking clock
globalThis.gstart_time = atlas_tools.get_time();
/***********************************************/
/*      Initialize the atlas scheduler         */
/***********************************************/
globalThis.atlas_scheduler = atlas_scheduler
atlas_wrapper.bootstrap()
globalThis.atlas_print = atlas_print
/***********************************************/
/*        Initialize atlas workers         */
/***********************************************/
if (local_execution == false) {
    atlas.allocate_clients(get_server_count());
    atlas_scheduler.setup_servers(server_file)
    server_count = get_server_count();
    worker_count = get_worker_count();
    servers_per_node = Math.floor(server_count / worker_count);
    servers_remaining = server_count;
}
/***********************************************/
/*        Initialize the atlas wrapper         */
/***********************************************/
globalThis.atlas_wrapper = atlas_wrapper
globalThis.wrapper = atlas_wrapper.wrapObject
// get battery statistics, it they are available
globalThis.atlas_battery = atlas_battery
globalThis.bat_start = atlas_battery.battery()
if (bat_start !== -1)
    atlas_print("#Start Battery:", bat_start)
// main execution
if (local_execution == false) {
    atlas_wrapper.spawn_workers();
} else {
    atlas_wrapper.execute_script()
    //atlas_tools.tidy_file();
}
