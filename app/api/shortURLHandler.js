var MongoClient = require('mongodb').MongoClient;
var winston = require('winston');

var findURL = require('./databaseInteraction/findURL.js');

module.exports = function(paramUrl, dbURL, callback) {
	MongoClient.connect(dbURL, function(e, db) {
		if (e) { winston.log('error', e); }
		findURL(db, 'short_url', paramUrl, function(result) {
      // if the short url was in the database, return it
      // the api will redirect the user tot he original url
			if (result) {
				winston.log('info', 'Short URL exists: \n' + JSON.stringify({
					original_url: result.original_url,
					short_url: result.short_url
				}));
				db.close();
				winston.log('info', 'database closed');
				callback(result);
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
