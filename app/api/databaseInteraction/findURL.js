var winston = require('winston');
var MongoClient = require('mongodb').MongoClient;

//	Search the database for the short_url or the original_url
// depending on the key
module.exports = function(dbURL, key, paramUrl) {
	return new Promise(function(resolve, reject) {
		MongoClient.connect(dbURL)
		.then(function(db) {
			winston.log('info', 'Querying...');
			// get the sites collection
			var sites = db.collection('sites');
			// set key for findOne function
			var query = {};
			query[key] = paramUrl;

			sites.findOne(query).then(function(value) {
				db.close();
				winston.log('info', 'Database Closed');
				resolve(value);
			});
		})
		.catch(function(reason) {
			reject(reason);
		});
	});
};
