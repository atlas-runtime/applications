# Overview

* [Real Applications](https://docs.google.com/presentation/d/1d9BW1u53wJ3C0A0yLc9Gj96aBgrMEQQgrtHJMVSO_6s/edit#slide=id.p)

TODO:
* Install my VI config
* `sudo`


# Applications

## Chat application
```sh
# Number of packages
ls ~/applications/chat-application/node-chat/node_modules/ -l | wc -l 

# get size of JS code — does NOT include tests etc.
cd applications/chat-application/node-chat/node_modules
find . -name "*.js" -type f | grep -v dist | grep -v build | grep -v test | grep -v node_modules | xargs -n1 wc -l | awk '{print $1}' | paste -sd+ | bc

# go to node-chat dir
cd ~/applications/chat-application/node-chat
# run the chat app, this will listen on port 3300
node app.js
```
App link: pac-n1.csail.mit.edu:3300

```sh
# extract the static permissions — from modules and everywhere
cd node_modules
mir-sa . > ../perm.json; cd ..; mir-sa . > perm2.json; jq -s '.[0] * .[1]' perm.json perm2.json > final.json; rm perm.json perm2.json
# enforce the permissions
../mir-da/index.js -e final.json app.js
```

I'll just pause for applause.

## Demo

Let's see how the tools are supposed to protect against attacks. A small real world demo with eval and a vulnerability.

```sh
cd ../../../attack-demo
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
node client/malicious.js # attack shouldn't succeed

ls -ll pwned.txt 
```
## Subset Exposition

### 1. Prototype Chain Method Skipping

Implementation traverses objects but (deliberately, for compat) skips pointers to prototypes.
This does not require the developer to change any application code, but will miss some checks; we plan to address this in the future.

Example 1:
```sh
cd problem-analysis

# Example 1
cd Prototyte-Chain-Method-Skipping/example1/ 
ls 
cat problem.js # Code snippet
node problem.js # Run code snippet

mir-sa problem.js > perm.json  # Run static analysis 
cat perm.json # shows `parseInt`, no `length`, or `split`

mir-da -e perm.json problem.js # Run enforcement — it passes!
```

Example 2:
```sh
# Example 2
cd ../example2/
ls  
cat problem.js # Code snippet
node problem.js # Run code snippet

mir-sa problem.js > perm.json  # Run static analysis 
cat perm.json

mir-da -e perm.json problem.js # Run enforcement 
```

### 2. Runtime Metaprogramming

Static analysis cannot infer permissions in cases of runtime metaprogramming.
To address this, a developer needs to change a few lines of code; but soon, we hope to address this with dynamic analysis.

Example 1, metaprogramming rewriting:
```sh
cd ../../Runtime-Metaprogramming
ls
cd example1/problem
cat problem.js
node problem.js

mir-sa . > perm.json # Run static analysis
cat perm.json

mir-da -e perm.json problem.js # Run enforcement

cd ../solution
cat solution.js

mir-sa . > perm.json # Run static analysis
cat perm.json
mir-da solution.js -e perm.json
```

Example 2, runtime augmentation:

```sh
cd ../../example2
ls
cat problem.js
node problem.js

mir-sa problem.js > perm.json # Run static analysis
cat perm.json

mir-da problem.js -p
# TODO: Merge the two
```

### 3. Special Built-in

Implementation wraps all primitives with indirection proxies, including special built-in values
There is no need for the developer to change the application code for this bug; they only need to change the system configuration.

Example 1, avoid tracing `Error` via flag (temporary fix):
```sh
cd ../../Special-Built-In/example1
ls
cat problem.js
node problem.js

mir-sa problem.js > perm.json # Run static analysis
cat perm.json

mir-da problem.js -p # Run dynamic analysis

# Solution: exclude Error
mir-da problem.js --prop-exclude 'Error' -p # Remove Error from dynamic analysis
mir-da problem.js -e perm.json --prop-exclude 'Error' # Run enforcement
```

Example 2, avoid tracing `undefined` via flag (soon part of default config):

```sh
cd ../example2
ls
cat problem.js
node problem.js

mir-sa problem.js > perm.json # Run static analysis
cat perm.json

mir-da problem.js -p # Run dynamic analysis

# Solution: exclude undefined
mir-da problem.js --prop-exclude 'undefined' -p # Remove Error from dynamic analysis
mir-da problem.js -e perm.json --prop-exclude 'undefined' # Run enforcement
```

### 4. Bug: Direct Import Invocation

Imported function is called directly upon import.
The developer needs to change a few lines of code for this bug, in both the importer and the importee.
This is the most common problem we experienced in porting applications.
We plan to fix this.

```sh
cd ../../Direct-Import-Invocation/example1/problem
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
cd ~/applications/atlas-demo

# in a new terminal, open the remote server
cd atlas-worker
./app -p 7000
# We are using HW support for SGX — this is not software emulation!
# this is the worker receiving remote requests
```

### Connect to the remote PI
```sh
ssh ops5g@cic.aarno-labs.com -p 5011
pass:wt%'z7P=MU+v$&"-(_j6/$6(#E>z]97-
ssh pi2

# after you have connected to the PI
# To get battery status
# We query the battery server (API); bunble comes with the battery module
./get_battery.sh

# Disable charging:
echo "set_allow_charging false" | nc -q 0 127.0.0.1 8423
# little loop script for using battery (to show consumption)
bash ~/loop-script.sh

# Enter the atlas demo folder
cd atlas-demo/atlas-client

# Encrypt & Sign wrapper
cat benchmarks/crypto_benchmark/crypto-wrapper.js

# atlas reads the input data for this benchmark from --input flag
# we have pre-generated several inputs in inputs/ folder
# to run atlas locally using 1MB input do:


# The output will be written to the output_local
# Battery consumption.
bash get_battery.sh
../quickjs/src/qjs atlas.js --file benchmarks/crypto_benchmark/demo.js --local --log output_local --input inputs/input_1048576

# # This will take about 800s (13 minutes)!
# MOVE BACK TO SLIDES

cat output_local
# Execute atlas using remote mode
# The output will be written to the output_remote
# Battery consumption and time HERE
bash get_battery.sh
../quickjs/src/qjs atlas.js --file benchmarks/crypto_benchmark/demo.js --servers 1 --log output_remote 
--input inputs/input_1048576
# tell: show that first comm sends the code — hence the largrer size!

cat output_remote
# Enable charging: 
echo "set_allow_charging true" | nc -q 0 127.0.0.1 8423 

```
