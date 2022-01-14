const serial = require('small-serial');
const http = require('http');
const ip = '127.0.0.1';
const arg = process.argv[2];
let port;

if (arg !== 'server.js') {
  port = process.argv[2] ? process.argv[2] : 8000;
} else {
  port = 8000;
}

const server = http.createServer((req, res) => {
  req.setEncoding('utf8');
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    let val = serial.dec(data);
    if (val && val.token == 'a1b2c33d4e5f6g7h8i9jakblc') {
      console.log('Api key:', val)
      res.end('Api key is ok');
    } else {
      console.log('Wrong Api key:', val)
      res.end('Wrong api key!');
    }
    
    process.exit();
  });
});

server.listen(port, ip, () => {
  console.log('running: ', ip, port);
});

server.on('error',(e) => {
  console.log(e)
});
