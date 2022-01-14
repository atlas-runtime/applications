export function execute_script() {
    atlas_print("#Start Duration Latency Bytes Interval End Mode Thread_ID Type Function Request_ID Battery_Status");
    // detect the modules we need to import
    atlas.import_modules();
    // trigger flag to detect imported local names to offload to the client
    atlas.start_wrapping();
    // start executing the client's code
    atlas.execute_script(file_to_exec);
}

/*
 * Bootstrap function 
 */
export function bootstrap() {
    globalThis.received_functions = new Map();
    globalThis.wrappedObjects = new Map();
    globalThis.pkt_received = 0;
    globalThis.pkt_sent = 0;
    globalThis.worker_array = [];
    globalThis.current_worker = 0;
    // total exec time
    globalThis.atlas_time = 0;
    globalThis.server_count = 0;
    globalThis.worker_count = 0;
    globalThis.servers_per_node = 0;
    globalThis.servers_remaining = 0;
}

/*
 * Variables used for scheduling 
 */
globalThis.last_latency = 0;
globalThis.remote_avg = 0;
globalThis.local_sd = 0;
globalThis.local_avg = 0;
globalThis.final_results = [];
globalThis.time = [];
var worker_ready = 0;

globalThis.atlas_get_received_function_count = function(func) {
    // on local execution, we have to resolve the real function name
    // i.e, when running benchmarks.encrypt_sign, only encrypt_sign will be parsed
    // whereas in remote, benchmarks.encrypt_sign will be parsed as function name
    // as a whole (which is what we want)
    let v = get_real_target_name(func);
    // if the entry is undefined, return 0;
    return received_functions.get(v) || 0;
}

globalThis.atlas_increase_function_count = function(func) {
    let entry = received_functions.get(func);
    if (entry === undefined)
        received_functions.set(func, 1);
    else
        // increase the existing counter (even if it doesn't exist, entry will be 0)
        received_functions.set(func, entry +1);
}

function write_worker_results(e)
{
    // count how many entries of each function we have received
    atlas_increase_function_count(e.func);
    let b = -1;
    if (globalThis.bat_start !== -1)
        b = atlas_battery.battery()
    atlas_print(e.started + '\t' + e.duration + '\t' + e.latency + '\t' + e.buffer_size + '\t' + e.interval+  '\t' + e.return  + '\t' + e.mode + '\t' + e.tid + '\t' + e.type + '\t' + e.func + '\t' + e.req_id + '\t' + b)
    /* 
     * if the type is not distibuted, don't count it as received, since its used
     * as initialization of the enclave nodes
     */
    globalThis.pkt_received++
}

/*
 * Get the average of the last n runs
 */
function get_latency_avg(arr)
{
    let n = arr.length
    let avg = 0
    for (let i = 0; i < n; i++)
        avg = avg + arr[i]
    return avg / n
}

/*
 * Fetch a worker for a task
 */
function pick_worker(n) {
    let wk = next_worker(n)
    current_worker++
    return wk
}

/*
 * Function to get the id of the next available worker for offloading
 */
function next_worker(n) {
    return current_worker % n
}

/*
 * Given a parsed object, craft an offload request package
 */
function craft_request(function_name, arguments_list)
{
    let deps = ''
    // send the modules only once
    deps = parse_request_modules(function_name)
    // get the next node to scheduler
    const node = atlas_scheduler.getNode();
    // Change the package name
    if (function_name.indexOf('/') != -1) {
        function_name = function_name.split('/');
        function_name = function_name[function_name.length - 1].split('.')[0]; 
    }
    // craft the atlas object to offload
    let request = {
        req_id : pkt_sent,
        nodeIp : node.ip,
        func: function_name,
        args: arguments_list,
        issued_time : atlas_tools.get_time(),
        inter: globalThis.interval,
        deps: deps,
        imports: find_imports(),
    }
    return request
}

/*
 * Condition that decides if we should scale up to more nodes
 */
function scale_up_condition() {
    if (local_avg === 0) {
        return (last_latency  > remote_avg * 1.1)
    } else
        return (last_latency  > remote_avg * 1.1) && (last_latency / local_avg) > remote_avg
}

/*
 * Condition that decides if we should scale down to less nodes
 */
function scale_down_condition() {
    return last_latency / remote_avg < remote_avg
}

/*
 * The actual scheduling policy that chooses whether we should use more or less
 * workers, using the atlas cloud
 */
function change_worker_count() {
    // we should scale here
    if (scale_up_condition() == true && actual_workers != total_workers.length) {
        actual_workers++
    } else if (scale_down_condition() == true && actual_workers != 1) {
        //actual_workers--
        //TODO
    }
    return 
}

globalThis.resolvers = {}

function promise_reference(wrk, request) {
    return new Promise((resolve, reject) => {
        total_workers[wrk].postMessage({type: "task_streaming", msg:request});
        resolvers[request.req_id] = resolve
    })
}

function change_msg_handler() {
    var worker_count = get_worker_count()
    for (let i = 0; i < worker_count; i++) {
        worker_array[i].onmessage = function(e) {
            write_worker_results(e.data.values);
	    //print(e.data.values.data)
            // resolve the value
            resolvers[e.data.values.req_id](e.data.values.data);
        }
    }
}

/*
 * We are in streaming mode, offload task remotely on workers
 */
function stream_packet(request) {
    // can we scale dynamically by allocating more workers
    if (globalThis.scaling == true) {
        change_worker_count()
    }
    // pick a worker
    let wrk = pick_worker(actual_workers);
    // if we have already forwarded all the modules to the target, skip re-sending them
    if (module_sent_to_all_workers[wrk] === 1) {
        request.deps = '';
    } else
        module_sent_to_all_workers[wrk] = 1;
    // offload the request to a worker
    return promise_reference(wrk, request)
}

/*
 * Offload to atlas nodes or local node
 */
function atlas_scale(function_name, arguments_list) {
    // generate an offloading request
    let request = craft_request(function_name, arguments_list)
    //increase the number of packets sent
    pkt_sent++;
    // offload the result
    return stream_packet(request);
}

function get_real_target_name(target){
    // the offloaded function name
    var found = false;
    // get the current target_name
    var target_name = target.name;
    for (let [i,v] of wrappedObjects) {
        var name = v.rname;
        var p = v.father;
        //atlas_print(i, target.name, target.father)
        //atlas_print('------------------------------------')
        //atlas_print('Checking:', i, i.name)
        //atlas_print('Value   :', stringify(v))
        //atlas_print('Args    :', stringify(...arguments_list))
        //atlas_print('Realname:', name)
        //atlas_print('Father  :', p)
        //atlas_print('Target  :', target)
        //atlas_print('TName   :', target.name)
        //atlas_print('TFather :', target.father)
        if (i.name === target.name && (target.father === name || (target.father !== name && p === false))) {
            switch(p) {
                case false:
                    //atlas_print('Offloading function, sending name only');
                    if (v.real_path !== target.name)
                        target_name = name
                    else
                        target_name = target_name;
                    found = true;
                    break;
                case true:
                    //atlas_print('Offloading object function call');
                    target_name = v.rname + '.' + target.name;
                    found = true;
                    break;
            }
            if (found === true)
                break;
        }
    }
    return target_name;
}

/*
 * In contrast with remote calls where we just offload the call name
 * i.e benchmarks.encrypt_sign (all this line will be transmitted to the other party
 * and the function will be executed remotely.
 * However, in local execution, all the code is executed command by command
 * Thus, by running encrypt_sign ---> AES.encrypt(...); HMAC(...); both of them
 * are ALREADY wrapped since they are a part of the original library, thus they 
 * return a promise object back to the client (a series of promises .....).
 * to solve this, we create a counter that shows if function A has not been called
 * by another wrapped function. If A is indeed the first, we increase the counter.
 * In our case, A = benchmarks.encrypt_sign, so the following calls AES.encrypt and
 * HMAC will enter the exec_local function and atlas_nested_fcalls will NOT be 0
 * thus, they will NOT have to return a PROMISE, but the actual value back to A
 */
let atlas_nested_fcalls = 0;
/* 
 * The handler to apply a proxy to a function
 */
const handler = {
    apply: function (target, p1, ...arguments_list) {
        // iterate all wrapped objects
        var target_name = get_real_target_name(target);
        if (local_execution == false)
            return atlas_scale(target_name, ...arguments_list);
        else {
            atlas_nested_fcalls++;
            var e = exec_local(target, target_name, ...arguments_list, "exec")
            atlas_nested_fcalls--;
            return e
        }
    }
}

function new_promise(p) {
    return new Promise(resolve => {
        resolve(p);
    });
}

/*
 * Wrap the local call to async to prevent blocking
 */
function exec_local(target, target_name, argumentsList, type) {
    
    let result = {};
    let issue_time = atlas_tools.get_time();
    result.started = atlas_tools.get_time_diff(atlas_tools.get_time(), gstart_time);
    let res = target.call(this, ...argumentsList);
    result.started;
    result.data = res;
    result.duration = atlas_tools.get_time_diff(atlas_tools.get_time(), issue_time);
    result.latency = atlas_tools.get_time_diff(atlas_tools.get_time(), gstart_time);
    result.interval = interval;
    result.return = atlas_tools.get_time_diff(atlas_tools.get_time(), gstart_time);
    result.mode = 'local';
    result.type = type;
    result.tid = -1;
    result.req_id = pkt_sent - 1;
    result.func = target_name;
    result.buffer_size = JSON.stringify(argumentsList).length;
    if (atlas_nested_fcalls !== 1)
        return res;
    write_worker_results(result);
    return new_promise(res);
}

const ignored_libs = []
ignored_libs[0] = "atlas-battery"
ignored_libs[1] = "atlas-scheduler"
ignored_libs[2] = "atlas-wrapper"
ignored_libs[3] = "atlas-worker"
ignored_libs[4] = "atlas-srl"
ignored_libs[5] = "atlas-tools"

// holds the required libs for each function call
let function_call_deps = new Map();

function basename(s) {
    return s.split('\\').pop().split('/').pop().split(".js")[0];
}

function find_imports() {
    let result = std.loadFile(file_to_exec).replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
    const patternImport = new RegExp(/import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*$/, 'mg')
        let p_match = result.match(patternImport)
        let s =''
        for (let i in p_match) {
            // convert " to ' in the imports                                     
            let tes = p_match[i].replaceAll('"', "'")                            
            // split ' to tokens                                                 
            let tok = tes.split("'")                                             
            // replace fullpath to basename                                      
            p_match[i] = p_match[i].replace(tok[1], basename(tok[1]))
            s = s + p_match[i] + '\n'
        }
        return s
    }   

function strip_import_path(f) {
    let result = std.loadFile(f) ;//.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
    const patternImport = new RegExp(/import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*$/, 'mg')
        let p_match = result.match(patternImport)
        let ct = 0
        for (let i in p_match) {
            // convert " to ' in the improts                                     
            let tes = p_match[i].replaceAll('"', "'")                            
            // split ' to tokens                                                 
            let tok = tes.split("'")                                             
            // replace fullpath to basename                                      
            result = result.replace(tok[1], basename(tok[1]))
        }
        return result
    }  

/*
 * we parse the request modules with their local variable names and exported name
 * we will send both the source code + import the modules using the local/exported name
 */
function parse_request_modules(fname) {
    let pair = function_call_deps.get(fname)

    // we found the entry, return it
    if (pair !== undefined) {
        return pair
    }
    let bench_ref = {}
    let mdata = atlas.read_modules()
    let s = mdata.split('\n').
        forEach((s) => {
            s = s.split(',')
            // so we have no more entries, exit loop
            if (s[0] == "")
                return 
            let atlas_lib = function() {
                for (let i in ignored_libs) {
                    if (s[0].includes(ignored_libs[i]))
                        return true
                }
                return false
            }
            // we don't want atlas libs
            if (atlas_lib())
                return 
            else {
                if (bench_ref[basename(s[0])] === undefined)
                    bench_ref[basename(s[0])] = {"source": strip_import_path(s[0]), "path":basename(s[0])};
            }
        });
    function_call_deps.set(fname, bench_ref)
    return bench_ref
}

/*
 * Wrapper function that identifies the bottlenecked functions
 * real_name: the defined variable that we may use // import {math} from './math.js' -> math is the real_name
 * import_name: the imported variable name (we don't use) // import {math as m} from './math.js' -> math -> imported, m: real_name
 */
export function wrapObject(nobj, real_name, import_name) {
    // Get the type of the object 
    const type = typeof(nobj);
    // If it is an function 
    if (type === 'function') {
        let obj = nobj
        if (import_name === '*')
            // we deep copy in case the obj is const
            obj = Object.assign(() => {}, nobj);
        // Wrap the function in a proxy 
        const wrappedObj = new Proxy(obj, handler);
        Object.defineProperty(obj, "father", { value: obj.name });
        if (obj.name === '') {
            Object.defineProperty(obj, 'name', { value: real_name });
        }
        // Store the wrapped obj 
        wrappedObjects.set(obj, {'rname' :real_name, 'father' : false});
        // and return it
        return wrappedObj;
        // If it is a object 
    } else if (type === 'object') {
        let obj = nobj;
        if (import_name === '*')
            // deep copy in case obj is const
            obj = Object.assign({}, nobj)
        // get the keys of the object
        const objKeys = Object.keys(obj);
        for (let key of objKeys) { 
            //if its an anonymous function
            if (typeof(obj[key]) === 'function'){ // && obj[key].name === undefined) {
                //rewrite the name property
                Object.defineProperty(obj[key], "name", { value: key });
                Object.defineProperty(obj[key], "father", { value: real_name });
                // wrap the function call with a proxy
                let p = new Proxy(obj[key], handler);
                // Store the wrapped obj
                wrappedObjects.set(p, {'rname' :real_name, 'father': true});
                obj[key] = p
            }
        }
        return obj
    }
    return nobj;
}

/*
 * Spawn the qjs workers for handling pending requests. Assign the atlas servers
 * to each one of the workers
 */
export function spawn_workers()
{
    globalThis.total_workers = []
    globalThis.module_sent_to_all_workers = []
    worker_count = get_worker_count()
    // assign the servers
    for (let i = 0; i < worker_count; i++) {
        var worker = new os.Worker("./atlas-worker.js");
        // assign the event listener
        worker.onmessage = function (e) {
            // initiate reading from the input after all the workers are ready
            worker_ready++
            /* consider the local worker */
            if (worker_ready == total_workers.length) {
                /*********************************************/
                // start running the script
                execute_script()
                /*********************************************/
                /* 
                 * after we have and injected tasks in our work queues
                 * trigger the workers to start offloading 
                 */
                worker_ready = 0
                change_msg_handler();
            }
        }
        module_sent_to_all_workers[i] = 0;
        // send tid to each worker
        worker.postMessage({type : "tid", tid:i, "gstart_time": globalThis.gstart_time})
        // server assignment
        if (i === get_worker_count() - 1) {
            globalThis.servers_per_node = servers_remaining
        }
        for (let j = 0; j < servers_per_node; j++) {
            const node = atlas_scheduler.getNode();
            worker.postMessage({type : "server", msg : node})
        }
        globalThis.servers_remaining = servers_remaining - servers_per_node
        globalThis.worker_array[i] = worker
        worker.postMessage({type : "ready"})
        globalThis.total_workers.push(worker)
    }
}
