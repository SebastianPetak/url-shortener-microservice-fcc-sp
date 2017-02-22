var winston = require('winston');
var MongoClient = require('mongodb').MongoClient;

//	Search the database for the short_url or the original_url
// depending on the key
module.exports = function(dbURL, key, paramUrl) {
	var db;
	return MongoClient.connect(dbURL).then(function(database) {
		db = database;
		winston.log('info', 'Querying...');
		var sites = db.collection('sites');
		// set key for findOne function
		var query = {};
		query[key] = paramUrl;
		return sites.findOne(query);
	}).then(function(queryResult) {
		return queryResult;
	}).finally(function() {
		db.close();
		winston.log('info', 'Database closed');
	});
};
