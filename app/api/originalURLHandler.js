var winston = require('winston');

var findURL = require('./databaseInteraction/findURL.js');
var insertURL = require('./databaseInteraction/insertURL.js');

module.exports = function(paramUrl, dbURL) {
	var handleNewURL = function () {
		winston.log('info', 'New URL being send to insertURL');
		return insertURL(dbURL, paramUrl).then(function(result) {
			winston.log('info', 'New data inserted into database: \n' + JSON.stringify({
				original_url: result.ops[0].original_url,
				short_url: result.ops[0].short_url
			}));
			return result;
		});
	};


	// Open the database and search for the original URL
	return findURL(dbURL, 'original_url', paramUrl).then(function(result) {
		if (result == null) {
			// If there are no matches, insert a new document
			return handleNewURL();
		// If there is a match, log it, then return it to index.js
		} else {
			winston.log('info', 'URL already exists in the database: ' + JSON.stringify({
				original_url: result.original_url,
				short_url: result.short_url
			}));
			return result;
		}
	});
};
