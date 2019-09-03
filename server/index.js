const express = require('express');
const app = express();

const path = require('path');

//const initializeDatabase = require('./rdb');

const baseDir = process.env.HOMEDIR;

const staticAssets = express.static(`${baseDir}/build`);

const HOME_URL = `https://oerwi.app`;

app.use((req, res, next) => {
	// redirect www to non-www
	if (req.hostname.indexOf('www') !== -1) {
		return res.redirect(HOME_URL);
	}

	next();
});

app.use(staticAssets);

/*
app.post('/list/create', (req, res) => {
	const dbHost = { host: 'localhost', port: 28015, db: 'oerwi' };
});
*/

app.use((req, res) => {
	res.sendFile(path.resolve(baseDir, './build/index.html'));
});

app.listen(80);
