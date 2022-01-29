out=demo
rm -rf ${out}
mkdir $out
echo "set_allow_charging false" | nc -q 0 127.0.0.1 8423
for (( c=16; c<=1024 * 1024; c = c * 2 ))
do                                       
	rm -f .tmp
	fallocate -l $c .tmp
	cat .tmp | sed 's/\x0/a/g' > my_input
	../quickjs/src/qjs atlas.js --file benchmarks/crypto_benchmark/demo.js --log $out/local_$c --local --input my_input
	column -t $out/local_$c > t ; mv t $out/local_$c
	echo $c
	rm -rf my_input
done                                     

echo "set_allow_charging true" | nc -q 0 127.0.0.1 8423
