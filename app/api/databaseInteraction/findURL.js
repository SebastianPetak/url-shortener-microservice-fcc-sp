//	Search the database for the short_url or the original_url
// depending on the handler function

module.exports = function(db, key,paramUrl, callback) {
	console.log('Querying...');
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
			console.log('Matching query does not exist');
			callback(null);
		}
	});
};
