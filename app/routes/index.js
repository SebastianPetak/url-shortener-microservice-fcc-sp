var validUrl = require('valid-url');
var normalizeUrl = require('normalize-url');
var originalURLHandler = require('../api/originalURLHandler.js');
var shortURLHandler = require('../api/shortURLHandler.js');

var shortURLRegExp = new RegExp('^[0-9]{7}$', 'g');

module.exports = function(app, dbURL) {
	app.get('/', function(req,res) {
		res.render('index');
	});

	app.get('/*', function(req,res) {
		var paramUrl = req.url.substr(1);
		console.log('URL Parameter: ' + paramUrl);

		// if parameter was an original url
		if (validUrl.isUri(paramUrl)) {
			// normalizes url to prevent duplication under different names e.g. https://www.google.com // https://google.com
			paramUrl = normalizeUrl(paramUrl);
			console.log('Sending normalized URL parameter to URL handler as: ' + paramUrl);
			originalURLHandler(paramUrl, dbURL, function(response) {
				var parsedJSON = JSON.parse(response);
				var fullShortURL = parsedJSON.short_url;
				res.send(response + ' Your Short URL is: https://shurl-sp.herokuapp.com/' + fullShortURL);
				console.log('response has ended\n');
			});

		// if parameter was in a short url format (7 digits)
		} else if (paramUrl.match(shortURLRegExp)) {
			console.log('Sending URL parameter to short-URL handler');
			// find and return document with matching short-URL value
			shortURLHandler(paramUrl, dbURL, function(response) {
				if (response) {
					var parsedJSON = JSON.parse(response);
					var originalURL = parsedJSON.original_url;
					// this redirects user to the original_url value stored in the database
					res.redirect(originalURL);
					console.log('User redirected to: ' + originalURL + '\n');
				} else {
					console.log('Short URL does not exist\n');
					res.send(JSON.stringify({'error': 'Short URL does not exist'}));
				}
			});

		// otherwise parameter wasn't in short url or original url format
		} else {
			console.log('URL parameter is not a valid URL\n');
			res.send(JSON.stringify({'error': 'No short url found for given input and input is not a valid url'}));
		}
	});
};
