const tiny = require('tiny-json-http');
const port = process.argv[2] ? process.argv[2] : 8000;
const url = 'http://localhost:'+ port +'/data';

var data = {token: 'a1b2c335f6g7h8i9jakblc'};

tiny.post({url, data}, (err, result) => {
  process.exit();
}); 
