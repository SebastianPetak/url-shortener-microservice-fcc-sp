var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
var winston = require('winston');

var findURL = require('./databaseInteraction/findURL.js');

module.exports = function(paramUrl, dbURL, callback) {
	MongoClient.connect(dbURL, function(e, db) {
		assert.equal(e, null);
		winston.log('info', 'Successfully connected to database');
		findURL(db, 'short_url', paramUrl, function(result) {
      // if the short url was in the database, return it
      // the api will redirect the user tot he original url
			if (result) {
				var response = JSON.stringify({
					original_url: result.original_url,
					short_url: result.short_url
				});
				winston.log('info', 'Short URL exists: \n' + response);
				db.close();
				winston.log('info', 'database closed');
				callback(response);
			// if the short url wasn't in the database, we will return an error
			} else {
				var responseNull = null;
				db.close();
				winston.log('info', 'database closed');
				callback(responseNull);
			}
		});
	});
};
