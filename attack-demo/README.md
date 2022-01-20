# Demo

A small real world demo with eval and a vulnerability
```sh
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
