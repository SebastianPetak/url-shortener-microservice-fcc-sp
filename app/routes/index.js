var validUrl = require('valid-url');
var normalizeUrl = require('normalize-url');
var winston = require('winston');

var originalURLHandler = require('../api/originalURLHandler.js');
var shortURLHandler = require('../api/shortURLHandler.js');

module.exports = function(app, dbURL) {
	app.get('/', function(req,res) {
		res.render('index');
	});

	// Matches short url
	app.get(/^\/[0-9]{7}$/, function(req,res) {
		var paramUrl = req.url.substr(1);
		winston.log('info', 'Sending URL parameter to short-URL handler');
		// find and return document with matching short-URL value
		shortURLHandler(paramUrl, dbURL).then(function(result) {
			if (result) {
				// this redirects user to the original_url value stored in the database
				// with status 302 for found
				res.redirect(result.original_url);
				winston.log('info', 'User redirected to: ' + result.original_url + '\n');
			} else {
				winston.log('info', 'Short URL does not exist\n');
				res.status(404).json({
					error: 'Short URL does not exist'
				});
			}
		}).catch(function(reason) {
			winston.log('error', reason);
			res.status(500).json({
				error: 'Internal Server Error'
			});
		});
	});

	// Matches original url
	app.get('/*', function(req,res) {
		var paramUrl = req.url.substr(1);
		winston.log('info', 'URL Parameter: ' + paramUrl);

		// if parameter is a valid uri
		if (validUrl.isUri(paramUrl)) {
			// normalizes url to prevent duplication under different names
			// e.g. https://www.google.com // https://google.com
			paramUrl = normalizeUrl(paramUrl);
			winston.log('info', 'Sending normalized URL parameter to URL handler as: ' + paramUrl);
			originalURLHandler(paramUrl, dbURL).then(function(result) {
				// result.ops is response from an MongoDB Insert command
				// result.original_url is response from MongoDB findOne command
				// Either way, we want to respond with the result.
				if (result.original_url !== undefined) {
					res.status(200).json({
						original_url: result.original_url,
						short_url: result.short_url
					});
				} else {
					res.status(200).json({
						original_url: result.ops[0].original_url,
						short_url: result.ops[0].short_url
					});
				}
			}).catch(function(reason) {
				winston.log('error', reason);
				res.status(500).json({
					error: 'Internal Server Error'
				});
			});

		// Otherwsie the url is neither a valid url or a short url.
		} else {
			winston.log('info', 'URL parameter is not a valid URL\n');
			res.status(404).json({
				error: 'Input is not a valid url'
			});
		}
	});
};
