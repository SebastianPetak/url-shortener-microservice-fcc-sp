var winston = require('winston');
var MongoClient = require('mongodb').MongoClient;

// if the original url wasn't in the database, insert it anad return it
module.exports = function(dbURL, paramUrl) {
	var db;
	return MongoClient.connect(dbURL).then(function(database) {
		db = database;
		winston.log('info', 'Inserting document...');
		var collection = db.collection('sites');
		// insert the url and a newly generated shorturl
		return collection.insert(
			{
				'original_url': paramUrl,
				'short_url': generateShortUrl()
			}
		);
	}).then(function(queryResult) {
		db.close();
		winston.log('info', 'Database closed');
		return queryResult;
	});
};

var generateShortUrl = function() {
	// return a 7 character string consisting of digits
	return String(Date.now()).slice(-4) + (Math.floor(Math.random() * (999 - 100) + 100));
};
