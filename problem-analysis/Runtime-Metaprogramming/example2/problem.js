/* Runtime Metaprogramming Code Snippet Example
 * https://github.com/atlas-runtime/applications/commit/670542d067ba29788f9b90a587d16663e7fd3a2e#r63350160
 */
var debug = process['env']['DEBUG'];

module.exports = { 
dec: (str) => {
    let obj;
    obj = eval('('+ str + ')');
    if (debug === true) {
      console.log(check);
    }
    return obj
  }
}
