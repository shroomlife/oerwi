const express = require('express')
const https = require('https')
const app = express()
const port = 443

const fs = require('fs');
const path = require('path');

const baseDir = process.env.HOMEDIR;

const staticAssets = express.static(`${baseDir}/build`)

const HOME_URL = `https://oerwi.app`;

app.use((req, res, next) => {

  // redirect www to non-www
  if(req.hostname.indexOf("www") !== -1) {
    return res.redirect(HOME_URL);
  }

  next()

});

app.use(staticAssets)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(baseDir, './build/index.html'))
})

https.createServer({
  key: fs.readFileSync('./.oerwi/privkey.pem'),
  cert: fs.readFileSync('./.oerwi/cert.pem')
}, app).listen(port, null, null, () => {
  console.log('app is listening ...');
})
