import {pw_exec} from './pw_app.js'
export function UpdateN_bench(size,updates,n){
    for(let i = 0; i < updates; i+=n) {
        pw_exec.pw_updaten(i, size, n);
    }
}
