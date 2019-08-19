const express = require('express')
const https = require('https')
const app = express()
const port = 8008

const fs = require('fs');

//const staticAssets = express.static();

app.get('/', (req, res) => res.send('Hello World!'))

https.createServer({
  key: fs.readFileSync('./runtime/privkey.pem'),
  cert: fs.readFileSync('./runtime/cert.pem')
}, app).listen(port, 'localhost', null, () => {
  console.log('app is listening ...');
})
