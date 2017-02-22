var winston = require('winston');

var findURL = require('./databaseInteraction/findURL.js');

module.exports = function(paramUrl, dbURL) {
	return findURL(dbURL, 'short_url', paramUrl).then(function(result) {
		// if the short url was in the database, log it
		// return the result, whether a match was found or not found
		if (result) {
			winston.log('info', 'Short URL exists: \n' + JSON.stringify({
				original_url: result.original_url,
				short_url: result.short_url
			}));
		}
		return result;
	});
};
