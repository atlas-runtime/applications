out=demo
rm -rf ${out}
mkdir $out
echo "set_allow_charging false" | nc -q 0 127.0.0.1 8423
for (( c=16; c<=1024 * 1024; c = c * 2 ))
do                                       
	rm -f .tmp input
	fallocate -l $c .tmp
	cat .tmp | sed 's/\x0/a/g' > input
	../quickjs/src/qjs atlas.js --file benchmarks/crypto_benchmark/demo.js --servers 1 --log $out/remote_$c
	column -t $out/remote_$c > t ; mv t $out/remote_$c
	../quickjs/src/qjs atlas.js --file benchmarks/crypto_benchmark/demo.js --log $out/local_$c --local
	column -t $out/local_$c > t ; mv t $out/local_$c
	echo $c
done                                     

echo "set_allow_charging true" | nc -q 0 127.0.0.1 8423
