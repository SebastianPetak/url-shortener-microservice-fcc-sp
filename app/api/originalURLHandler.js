var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
var winston = require('winston');

var findURL = require('./databaseInteraction/findURL.js');
var insertURL = require('./databaseInteraction/insertURL.js');

module.exports = function(paramUrl, dbURL, callback) {
	MongoClient.connect(dbURL, function(e, db) {
		assert.equal(e, null);
		winston.log('info', 'Successfully connected to server');
		findURL(db,'original_url', paramUrl, function(result) {
			// if we find a match in the database, just return the match
			if (result) {
				winston.log('info', 'URL already exists in the database: ' + JSON.stringify({
					original_url: result.original_url,
					short_url: result.short_url
				}));
				db.close();
				winston.log('info', 'database closed');
				callback('URLExisted', result);
			// if the url wasn't in the database, insert it
			} else {
				winston.log('info', 'New URL being send to insertURL');
				insertURL(db, paramUrl, function(result) {
					winston.log('info', 'New data inserted into database: \n' + JSON.stringify({
						original_url: result.ops[0].original_url,
						short_url: result.ops[0].short_url
					}));
					db.close();
					winston.log('info', 'database closed');
					callback('URLNew', result);
				});
			}
		});
	});
};
