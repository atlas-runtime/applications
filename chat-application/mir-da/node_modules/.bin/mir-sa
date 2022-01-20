#!/usr/bin/env node

/*
java -Dbase.stars=true -Dprop.stars=true -jar ./mir-sa.jar ./tests/t15/m1.js
java -Dmaybe.reaching=true -Dnpm.pkg.level=true -Dtarget.module=argparse -jar mir-sa.jar ./path-to-npm-package-folder
*/

var pkg = require("./package.json");
var fs = require("fs");
var path = require('path');
var jar = path.join(__dirname, 'deps', 'mir-sa.jar');
var spawn = require('child_process').spawn;

var version = "v" + pkg.version + " (jar > 4273fb2a)";
var h = `Statically analyze JavaScript files, modules, or directories to extract RWX sets.

mir-sa [f] [bfmp] [i=<tm>]

  f                       File-system path to focus analysis on; defaults to '.'

  -h,   --help':          Output (this) help 
  -v    --version:        Output version information
  -d, dd, ddd, --debug:   Add (multiple) verbosity levels
  -b,   --base-stars:     When a field of a dynamically-resolved object is accessed, output '*.fld'
  -f,   --field-stars:    When a dynamically-resolved field of an object is accessed, output 'obj.*'
  -m,   --maybe-reaching: Use a may-reach analysis, rather than a def-reach
  -p,   --package-level:  Group permissions at the level of entire packages
  -i,   --include <tm>:   Focus the analysis on a single module <tm> that the target module uses
`;
let help = () => {console.log(h); }

if (require.main !== module) { 
  help();
  return false;
}

const arg = require('arg');
const template = {
    // Types
    '--help':             Boolean,
    '--version':          Boolean,
    '--debug':            arg.COUNT,
    '--base-stars':       Boolean,
    '--field-stars':      Boolean,
    '--maybe-reaching':   Boolean,
    '--package-level':    Boolean,
    '--target-module':    [String],

    // Aliases
    '-h':                 '--help',
    '-v':                 '--version',
    '-d':                 '--debug',
    '-b':                 '--base-stars',
    '-f':                 '--field-stars',
    '-m':                 '--maybe-reaching',
    '-p':                 '--package-level',
    '-t':                 '--target-module',
};

let args;
try {
  args = arg(template);
} catch (e) {
  console.log(e.message);
  process.exit();
}

if (args["--help"]){
  help();
  process.exit();
}

if (args["--version"]) {
  console.log("v" + pkg.version + " (extractor: 8799cd1)");
  process.exit();
}

let cwd;
switch (args["_"].length) {
  case 0:
    cwd = process.cwd()
    break;
  case 1:
    cwd = process.cwd() + path.sep +  args["_"][0]
    break;
  default:
    console.log("Too many ``extra'' parameters: " + args["_"].join(", "));
    process.exit(-1);
}

var jargs = [];
if (args['--base-stars']) {
  jargs.push("-Dbase.stars=true");
}
if (args['--field-stars']) {
  jargs.push("-Dprop.stars=true");
}
if (args['--maybe-reaching']) {
  jargs.push("-Dmaybe.reaching=true");
}
if (args['--package-level']) {
  jargs.push("-Dnpm.pkg.level=true");
}
if (args['--target-module']) {
  jargs.push("-Dtarget.module=" + args['--target-module'].join(","));
}

jargs = jargs.concat(['-jar', jar, cwd]);
var mir = spawn('java', jargs);
var parse = JSON.parse;
var emit = JSON.stringify;

var beautify = (s) => {
  return emit(parse(output.split('\n').filter(e => e.startsWith('{'))[0]), null, 2)
}

var output = "";
mir.stdout.on('data', (data) => {
  output += data
  //console.out(data);
});

mir.stderr.on('data', (data) => {
  console.error(data);
});

mir.on('close', (code) => {
  // console.log(`child process exited with code ${code}`);
  console.log(beautify(output))
});

