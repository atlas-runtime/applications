import {Nouns_bench} from 'benchmarks/macro/nlp/Nouns.js'
let input = std.loadFile('./benchmarks/macro/nlp/birds.txt');
input = ''
let cc = input / 64
for (let i = 0; i < cc; i++)
    input[i] = cc[i]
print(Nouns_bench(input))
print(Nouns_bench(input))
print(Nouns_bench(input))

