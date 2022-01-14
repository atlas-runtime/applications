function DeleteN_bench(size,updates,n){

    // for (let n = 0; n < atlas_scheduler.nodes; n++){
    // }
    // print(`*createdb ${size} done*`)

    for(let i = 0; i < updates; i+=n) {
        pw_exec.pw_deleten(i, size, n);//, 'username' + i%size, 'updated_password'+i%size)
    }
	// print("*deleten done*")
}

