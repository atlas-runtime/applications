import {pw_exec} from './pw_app.js'
export function ReadN_bench(size,updates,n){
    for(let i = 0; i < updates; i+=n) {
        pw_exec.pw_readn(i, size, n);
    }
}
