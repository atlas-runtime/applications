import {SHA512} from 'benchmarks/crypto-es/lib/sha512.js';
let input = ''
for (let i = 0; i < 100000; i++)
    input = input + i

print(SHA512(input))
print(SHA512(input))
print(SHA512(input))
