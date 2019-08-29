const rdb = require('rethinkdb');

function initializeDatabase(options) {
	return new Promise((resolve, reject) => {
		rdb
			.connect(options)
			.then((connection) => {
				rdb
					.dbList()
					.run(connection, (err, result) => {
						if (err) return reject();

						if (result.includes(options.db)) {
							initializeTables(connection, resolve, options);
						} else {
							console.log('CREATING DB...');
							rdb.dbCreate(options.db).run(connection, (err, result) => {
								initializeTables(connection, resolve, options);
							});
						}
					})
					.catch(reject);
			})
			.catch(reject);
	});
}

const tables = [ 'lists' ];

function initializeTables(connection, resolve, options) {
	connection.use(options.db);
  
  Promise.all(tables.map(tableName => {
    return rdb.tableCreate(tableName).run(connection).catch(function(err) {
      console.log(`${tableName} already exists, skipping ...`);
    });
  })).then(() => {
		resolve(connection);
  });
}

const dbHost = { host: 'localhost', port: 28015, db: 'oerwi' };

initializeDatabase(dbHost).then((connection) => {
	connection.close();
});

module.exports = initializeDatabase;
