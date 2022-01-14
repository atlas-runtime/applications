# Atlas Demo
## Setup remove server on pac-n1
```sh
# in a new terminal, open the remote server
cd atlas-worker
./app -p 7000
```

## Connect to the remote PI
```sh
ssh ops5g@cic.aarno-labs.com -p 5011
pass:wt%'z7P=MU+v$&"-(_j6/$6(#E>z]97-
ssh pi2

# after you have connected to the PI
# To get battery status
bash ~/.get_battery.sh

# Disable charging:
echo "set_allow_charging false" | nc -q 0 127.0.0.1 8423

# Enter the atlas demo folder
cd atlas-demo/atlas-client

# Encrypt & Sign wrapper
cat benchmarks/crypto_benchmark/crypto-wrapper.js

# atlas reads the input from a file called 'input'
# to generate a file containing 'a' for 1MB
# Remove .tmp if it exists
rm -f .tmp
fallocate -l 1048576 .tmp
cat .tmp | sed 's/\x0/a/g' > input
# should show 1MB
wc -c input

# Execute atlas using local mode
# The output will be written to the output_local
../quickjs/src/qjs atlas.js --file benchmarks/crypto_benchmark/demo.js --local --log output_local

cat output_local
# Execute atlas using remote mode
# The output will be written to the output_remote
../quickjs/src/qjs atlas.js --file benchmarks/crypto_benchmark/demo.js --servers 1 --log output_remote

cat output_remote
# Enable charging: 
echo "set_allow_charging true" | nc -q 0 127.0.0.1 8423 

```

