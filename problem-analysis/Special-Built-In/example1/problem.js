/* Special Built-Ins Code Snippet Example
 * https://github.com/atlas-runtime/applications/blob/33a252f73ee6faea7e7f6a4ab80306416ee0311a/chat-application/node-chat/node_modules/http-errors/index.js#L261 
 */

// constructor
var HttpError = {} 
var msg = "error"
createError = (e)=> console.log(e)

var err = HttpError
	? new Error(msg)
	: null
Error.captureStackTrace(err, createError)
