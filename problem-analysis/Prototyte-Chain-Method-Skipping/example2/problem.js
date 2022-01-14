/* Prototype-Chain Method Skipping Example Code Snippet 
 * https://github.com/atlas-runtime/applications/blob/670542d067ba29788f9b90a587d16663e7fd3a2e/chat-application/node-chat/node_modules/faye-websocket/lib/faye/eventsource.js#L90
 */

request = {};
request.method = "GET";
request.headers = "GET /tutorials/other/top-20-mysql-best-practices/ HTTP/1.1"

if (request.method !== 'GET') return false;
var accept = (request.headers.accept || '').split(/\s*,\s*/);
return accept.indexOf('text/event-stream') >= 0;
