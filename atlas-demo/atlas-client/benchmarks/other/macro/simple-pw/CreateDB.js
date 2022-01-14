
import {pw_exec} from './pw_app.js'
export function pw_bootstrap(size,updates,n){
	
    // for (let n = 0; n < atlas_scheduler.nodes; n++){
    pw_exec.pw_createdb(size)
    // }
    // print(`*createdb ${size} done*`)
}

// CreateDB_bench(20000,200000,10000)
