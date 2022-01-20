# mir-sa

Statically analyze JavaScript files, modules, or directories to extract RWX sets.

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


## Example Run

```
mir-sa -b ./node_modules | jq .
```
