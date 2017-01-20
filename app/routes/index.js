var validUrl = require('valid-url');
var normalizeUrl = require('normalize-url');
var winston = require('winston');

var originalURLHandler = require('../api/originalURLHandler.js');
var shortURLHandler = require('../api/shortURLHandler.js');

// Used to determine if url parameter is a short URL
var shortURLRegExp = new RegExp('^[0-9]{7}$', 'g');

module.exports = function(app, dbURL) {
	app.get('/', function(req,res) {
		res.render('index');
	});

	app.get('/*', function(req,res) {
		var paramUrl = req.url.substr(1);
		winston.log('info', 'URL Parameter: ' + paramUrl);

		// if parameter was an original url
		if (validUrl.isUri(paramUrl)) {
			// normalizes url to prevent duplication under different names e.g. https://www.google.com // https://google.com
			paramUrl = normalizeUrl(paramUrl);
			winston.log('info', 'Sending normalized URL parameter to URL handler as: ' + paramUrl);
			originalURLHandler(paramUrl, dbURL, function(type, response) {
				// working with response from findURL
				if (type == 'URLExisted') {
					res.status(200).json({
						original_url: response.original_url,
						short_url: response.short_url
					});
				} else {
				// working with response from insertURL
					res.status(200).json({
						original_url: response.ops[0].original_url,
						short_url: response.ops[0].short_url
					});
				}
				winston.log('info', 'response has ended\n');
			});

		// if parameter was in a short url format (7 digits)
		} else if (paramUrl.match(shortURLRegExp)) {
			winston.log('info', 'Sending URL parameter to short-URL handler');
			// find and return document with matching short-URL value
			shortURLHandler(paramUrl, dbURL, function(response) {
				if (response) {
					// this redirects user to the original_url value stored in the database
					// with status 302 for found
					res.redirect(response.original_url);
					winston.log('info', 'User redirected to: ' + response.original_url + '\n');
				} else {
					winston.log('info', 'Short URL does not exist\n');
					res.status(500).json({error: 'Short URL does not exist'});
				}
			});

		// otherwise parameter wasn't in short url or original url format
		} else {
			winston.log('info', 'URL parameter is not a valid URL\n');
			res.status(404).json({
				error: 'No short url found for given input and input is not a valid url'
			});
			//res.status(500).json({error: 'No short url found for given input and input is not a valid url'});
		}
	});
};
