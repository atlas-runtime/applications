/*  Prototype-Chain Method Skipping Example Code Snippet
 *  https://github.com/atlas-runtime/applications/blob/670542d067ba29788f9b90a587d16663e7fd3a2e/chat-application/node-chat/node_modules/ipaddr.js/lib/ipaddr.js#L435
 */

var str = "data" 
function data () {
  var k, len, ref, results;
  ref = str.split(":");
  results = [];
  for (k = 0, len = ref.length; k < len; k++) {
    part = ref[k];
    results.push(parseInt(part, 16));
  }
}

data()
