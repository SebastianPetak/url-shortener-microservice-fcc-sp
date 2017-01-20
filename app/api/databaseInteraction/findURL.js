var winston = require('winston');

//	Search the database for the short_url or the original_url
// depending on the key
module.exports = function(db, key, paramUrl, callback) {
	winston.log('info', 'Querying...');
	// get the sites collection
	var sites = db.collection('sites');
	// set key for findOne function
	var query = {};
	query[key] = paramUrl;
	// find document with url the user passed
	sites.findOne(query, function(e, result) {
		if (e) {
			throw e;
		}	else if (result) {
			callback(result);
		}	else {
			winston.log('info', 'Matching query does not exist');
			callback(null);
		}
	});
};
