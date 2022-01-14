/* Special Built-Ins Code Snippet Example
 * https://github.com/atlas-runtime/applications/blob/624f1260d659df93deca68105917fac7daf932c4/chat-application/node-chat/node_modules/qs/lib/parse.js#L141
 */
var opts = {}
var options = opts ? Object.assign({}, opts) : {};

if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
	throw new TypeError('Decoder has to be a function.');
}
