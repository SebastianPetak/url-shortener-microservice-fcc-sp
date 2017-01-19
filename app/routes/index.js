var validUrl = require('valid-url');
var normalizeUrl = require('normalize-url');
var winston = require('winston');

var originalURLHandler = require('../api/originalURLHandler.js');
var shortURLHandler = require('../api/shortURLHandler.js');

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
			originalURLHandler(paramUrl, dbURL, function(response) {
				var parsedJSON = JSON.parse(response);
				var fullShortURL = parsedJSON.short_url;
				res.send(response + ' Your Short URL is: https://shurl-sp.herokuapp.com/' + fullShortURL);
				winston.log('info', 'response has ended\n');
			});

		// if parameter was in a short url format (7 digits)
		} else if (paramUrl.match(shortURLRegExp)) {
			winston.log('info', 'Sending URL parameter to short-URL handler');
			// find and return document with matching short-URL value
			shortURLHandler(paramUrl, dbURL, function(response) {
				if (response) {
					var parsedJSON = JSON.parse(response);
					var originalURL = parsedJSON.original_url;
					// this redirects user to the original_url value stored in the database
					res.redirect(originalURL);
					winston.log('info', 'User redirected to: ' + originalURL + '\n');
				} else {
					winston.log('info', 'Short URL does not exist\n');
					res.send(JSON.stringify({'error': 'Short URL does not exist'}));
				}
			});

		// otherwise parameter wasn't in short url or original url format
		} else {
			winston.log('info', 'URL parameter is not a valid URL\n');
			res.send(JSON.stringify({'error': 'No short url found for given input and input is not a valid url'}));
		}
	});
};
