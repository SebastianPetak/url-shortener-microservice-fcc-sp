var winston = require('winston');
var MongoClient = require('mongodb').MongoClient;

// if the original url wasn't in the database, insert it anad return it
module.exports = function(dbURL, paramUrl) {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(dbURL).then(function(db) {
			// get the sites collection
			winston.log('info', 'Inserting document...');
			var collection = db.collection('sites');
			// insert the url and a newly generated shorturl
			collection.insert(
				{'original_url': paramUrl,
					'short_url': generateShortUrl()
				})
					.then(function(result) {
						db.close();
						winston.log('info', 'Database closed');
						resolve(result);
					});
		}).catch(function(reason) {
			reject(reason);
		});
	});
};

var generateShortUrl = function() {
	// return a 7 character string consisting of digits
	return String(Date.now()).slice(-4) + (Math.floor(Math.random() * (999 - 100) + 100));
};
