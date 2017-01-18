var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
var findURL = require('./databaseInteraction/findURL.js');
var insertURL = require('./databaseInteraction/insertURL.js');

module.exports = function(paramUrl, dbURL, callback) {
	MongoClient.connect(dbURL, function(e, db) {
		assert.equal(e, null);
		console.log('Successfully connected to server');
		findURL(db,'original_url', paramUrl, function(result) {
			// if we find a match in the database, just return the match
			if (result) {
				var response = JSON.stringify({
					original_url: result.original_url,
					short_url: result.short_url
				});
				console.log('URL already exists in the database: ' + response);
				db.close();
				console.log('database closed');
				callback(response);
			// if the url wasn't in the database, insert it
			} else {
				console.log('New URL being send to insertURL');
				insertURL(db, paramUrl, function(result) {
					var response = JSON.stringify({
						original_url: result.ops[0].original_url,
						short_url: result.ops[0].short_url
					});
					console.log('New data inserted into database: \n' + response);
					db.close();
					console.log('database closed');
					callback(response);
				});
			}
		});
	});
};
