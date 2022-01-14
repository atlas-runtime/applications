/* Runtime Metaprogramming Code Snippet Example 
 * https://github.com/atlas-runtime/applications/commit/670542d067ba29788f9b90a587d16663e7fd3a2e#r63350160
 */

const func = () => {}
Object.defineProperty(module.exports, 'json', {
  configurable: true,
  enumerable: true,
  get: func,
})
