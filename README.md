# Applications

## Chat application
```sh
# Number of packages
ls ~/applications/chat-application/node-chat/node_modules/ -ll | wc -l 

# get size of JS code
cd applications/chat-application/node-chat/node_modules
find . -name "*.js" -type f | grep -v dist | grep -v build | grep -v test | grep -v node_modules | xargs -n1 wc -l | awk '{print $1}' | paste -sd+ | bc

# go to node-chat dir
cd ~/applications/chat-application/node-chat
# run the chat app, this will listen on port 3300
node app.js

# extract the static permissions
cd node_modules
mir-sa . > ../perm.json; cd ..; mir-sa . > perm2.json; jq -s '.[0] * .[1]' perm.json perm2.json > final.json; rm perm.json perm2.json
# enforce the permissions
../mir-da/index.js -e final.json app.js
```

## Demo

A small real world demo with eval and a vulnerability
```sh
cd demo
cat server.js 
cat client/benign.js 
cat client/benign2.js 

node server.js   
node client/benign.js 

node server.js   
node client/benign2.js 

ls -ll pwned.txt 
node server.js   
node client/malicious.js 
ls -ll pwned.txt 

rm pwned.txt  
cat client/malicious.js

cat node_modules/small-serial/index.js
mir-sa node_modules/small-serial/index.js | jq
mir-sa node_modules/small-serial/index.js > perm.json

./mir-da/index.js server.js --module-include /node_modules/small-serial/index.js -e perm.json --prop-exclude 'eval'
node client/benign.js 

./mir-da/index.js server.js --module-include /node_modules/small-serial/index.js -e perm.json --prop-exclude 'eval'
node client/malicious.js

ls -ll pwned.txt 
```
## Problem analysis

### Language and Bugs Example

#### Prototype Chain Method Skipping

Implementation traverses objects but (deliberately, for compat) skips pointers to prototypes
There is no need for the developer to change the application code for this bug.

```sh
cd problem-analysis

# Example 1
cd Prototyte-Chain-Method-Skipping/example1/ 
ls 
cat problem.js # Code snippet
node problem.js # Run code snippet

mir-sa problem.js > perm.json  # Run static analysis 
cat perm.json

mir-da -e perm.json problem.js # Run enforcement 

# Example 2
cd ../example2/
ls  
cat problem.js # Code snippet
node problem.js # Run code snippet

mir-sa problem.js > perm.json  # Run static analysis 
cat perm.json

mir-da -e perm.json problem.js # Run enforcement 
```

### Runtime Metaprogramming

Static analysis cannot infer permissions in cases of runtime metaprogramming.
The developer needs to change one or two lines of code for this bug.

```sh
cd ../../Runtime-Metaprogramming
ls
cd example1/problem
cat problem.js
cat main.js
node main.js

mir-sa . > perm.json # Run static analysis
cat perm.json

mir-da -e perm.json main.js # Run enforcement

cd ../solution
cat solution.js
cat main.js

mir-sa . > perm.json # Run static analysis
cat perm.json
mir-da -e main.js -e perm.jsons

cd ../../example2
ls
cat problem.js
node problem.js

mir-sa problem.js > perm.json # Run static analysis
cat perm.json

mir-da problem.js -p
```

#### Special Built-in

Implementation wraps all primitives with indirection proxies, including special built-in values
There is no need for the developer to change the application code for this bug.

```sh
cd Special-Built-In/example1
ls
cat problem.js
node problem.js

mir-sa problem.js > perm.json # Run static analysis
cat perm.json

mir-da problem.js -p # Run dynamic analysis
mir-da problem.js --prop-exclude 'Error' -p # Remove Error from dynamic analysis
mir-da problem.js -e perm.json --prop-exclude 'Error' # Run enforcement

cd ../example2
ls
cat problem.js
node problem.js

mir-sa problem.js > perm.json # Run static analysis
cat perm.json

mir-da problem.js -p # Run dynamic analysis
mir-da problem.js --prop-exclude 'undefined' -p # Remove Error from dynamic analysis
mir-da problem.js -e perm.json --prop-exclude 'undefined' # Run enforcement
```

#### Bug: Direct Import Invocation

Imported function is called directly upon import.
The developer needs to change two lines of code for this bug.

```sh
cd Direct-Import-Invocation/example1/problem
ls
cat problem.js 
cat problem_m1.js

mir-sa . > perm.json
cat perm.json

mir-da problem.js -p
mir-da problem.js -e perm.json

cd ../solution
ls
cat solution.js
cat solution_m1.js

mir-sa . > perm.json
cat perm.json

mir-da solution.js -p
mir-da solution.js -e perm.json
```

## Atlas demo

### Setup remove server on pac-n1
```sh
cd atlas-demo

# in a new terminal, open the remote server
cd atlas-worker
./app -p 7000
```

### Connect to the remote PI
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

