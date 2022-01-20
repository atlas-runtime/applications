for (( c=1024; c<=1024 * 1024; c = c * 2 ))
do
	rm -f .tmp
	fallocate -l $c .tmp
	cat .tmp | sed 's/\x0/a/g' > input_$c
	rm .tmp
done
