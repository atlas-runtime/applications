globalThis.msg = parse(atlas_data)
if (msg.nonce != current_nonce) {
    print("Expected:", current_nonce, "received:", msg.nonce)
    std.exit(1)
}

t=msg.deps
//print("System Imports:", msg.imports)
for (let i in t) {
    // get the key --- libname
    let o = t[i]
    // we have already pushed to global state
    if (o.source === "" || o.source === undefined)  
        break;
    atlas.execute_script(o.source, o.path)
}

function import_globals(a) {
    let str = a + "\n;do_rest(" + stringify(msg) + ',' + msg.func + ');'
    atlas.execute_script(str, "<script>");
    return 
}

globalThis.do_rest = function(msg, func) {
    atlas_data = func.apply(this, msg.args)
    if (atlas_data === undefined)
        atlas_data = "done"
    // increase the nonce
    current_nonce++
    var results = stringify({data : atlas_data.toString(), nonce : current_nonce});
    console.write_to_client(results);
    //print(atlas_data)
    // gc every 10 pkts
    if (current_nonce % 10)
        std.gc()
}
import_globals(msg.imports)
