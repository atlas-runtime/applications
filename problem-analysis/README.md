## Language and Bugs Example

### Prototype Chain Method Skipping

Implementation traverses objects but (deliberately, for compat) skips pointers to prototypes
There is no need for the developer to change the application code for this bug.

```sh
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

### Special Built-in

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

### Bug: Direct Import Invocation

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
