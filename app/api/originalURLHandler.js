var winston = require('winston');

var findURL = require('./databaseInteraction/findURL.js');
var insertURL = require('./databaseInteraction/insertURL.js');

module.exports = function(paramUrl, dbURL) {
	return new Promise(function(resolve, reject) {
		// Open the database and search for the original URL
		findURL(dbURL, 'original_url', paramUrl)
		// If there are no matches, insert a new document
		.then(function(result) {
			if (result == null) {
				handleNewURL();
			// If there is a match, log it, then return it to index.js
			} else {
				winston.log('info', 'URL already exists in the database: ' + JSON.stringify({
					original_url: result.original_url,
					short_url: result.short_url
				}));
				resolve(result);
			}
		}).catch(function(reason) {
			reject(reason);
		});

		var handleNewURL = function () {
			winston.log('info', 'New URL being send to insertURL');
			insertURL(dbURL, paramUrl).then(function(result) {
				winston.log('info', 'New data inserted into database: \n' + JSON.stringify({
					original_url: result.ops[0].original_url,
					short_url: result.ops[0].short_url
				}));
				resolve(result);
			});
		};
	});
};
