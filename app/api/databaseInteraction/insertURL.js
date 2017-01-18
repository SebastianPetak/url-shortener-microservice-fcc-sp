var assert = require('assert');

// if the original url wasn't in the database, insert it anad return it
module.exports = function(db, paramUrl, callback) {
	// get the sites collection
	console.log('Inserting document...');
	var collection = db.collection('sites');
	// insert the url and a newly generated shorturl
	collection.insert(
		{'original_url': paramUrl,
			'short_url': generateShortUrl()},
		function(e, result) {
			if (e) {
				throw e;
			}
			assert.equal(e, null);
			assert.equal(1, result.result.n);
			assert.equal(1, result.ops.length);
			callback(result);
		});
};

var generateShortUrl = function() {
	// return a 7 character string consisting of digits
	return String(Date.now()).slice(-4) + (Math.floor(Math.random() * (999 - 100) + 100));
};
