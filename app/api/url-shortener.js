//require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient
	,assert = require('assert');
var dbUrl = 'mongodb://localhost:27017/data';
var url = require('url');
var validUrl = require('valid-url');
const normalizeUrl = require('normalize-url');

var api = require('./app/api/url-shortener.js');
var routes = require('.app/routes/index.js');


var re = new RegExp("^[0-9]{7}$", "g");

module.exports = function(app) {
	app.get('/*', function(req,res) {
		var paramUrl = req.url.substr(1);
		console.log("URL Parameter: " + paramUrl);
		if (validUrl.isUri(paramUrl)) {
			paramUrl = normalizeUrl(paramUrl);
			console.log("Sending normalized URL parameter to URL handler as: " + paramUrl);
			originalURLHandler(paramUrl, function(response) {
				var parsedJSON = JSON.parse(response);
				var fullShortURL = parsedJSON.short_url;
				res.send(response + " Your Short URL is: https://shurl-sp.herokuapp.com/" + fullShortURL);
				console.log("response has ended\n");
			});
		} else if (paramUrl.match(re)) {
			console.log("Sending URL parameter to short-URL handler");
			// find and return document with matching short-URL value
			shortURLHandler(paramUrl, function(response) {
				if (response) {
					var parsedJSON = JSON.parse(response);
					var originalURL = parsedJSON.original_url
					res.redirect(originalURL);
					console.log("User redirected to: " + originalURL)
				} else {
					console.log("Short URL does not exist\n");
					res.send(JSON.stringify({"error": "Short URL does not exist"}));
				}
			});
		} else {
			console.log("URL parameter is not a valid URL\n");
			res.send(JSON.stringify({"error": "No short url found for given input and input is not a valid url"}));
		}
	});
		

	var originalURLHandler = function(paramUrl, callback) {
		MongoClient.connect(process.env.MONGOLAB_URI || dbUrl, function(e, db) {
			assert.equal(e, null);
			console.log("Successfully connected to server");
			findUrl(db,"original_url", paramUrl, function(result) {
				if (result) {
					var response = JSON.stringify({
							original_url: result.original_url,
							short_url: result.short_url
						});
					console.log("URL already exists in the database: " + response);
					db.close();
					console.log("database closed");
					callback(response);
				} else {
					console.log("New URL being send to insertUrl");
					insertUrl(db, paramUrl, function(result) {
						var response = JSON.stringify({
							original_url: result.ops[0].original_url,
							short_url: result.ops[0].short_url
						});
						console.log("New data inserted into database: \n" + response);
						db.close();
						console.log("database closed");
						callback(response);
					});
				}
			});
		});
	};

	var shortURLHandler = function(paramUrl, callback) {
		MongoClient.connect(dbUrl, function(e, db) {
			assert.equal(e, null);
			console.log("Successfully connected to database");
			findUrl(db, "short_url", paramUrl, function(result) {
				if (result) {
					var response = JSON.stringify({
						original_url: result.original_url,
						short_url: result.short_url
					});
					console.log("Short URL exists: \n" + response);
					db.close();
					console.log("database closed");
					callback(response);
				} else {
					var response = null;
					db.close();
					console.log("database closed");
					callback(response);
				}
			});
		});
	};

	var findUrl = function(db, key, paramUrl, callback) {
		console.log("Querying...");
		// get the sites collection
		var sites = db.collection('sites');
		// set key for findOne function
		query = {};
		query[key] = paramUrl;
		// find documents with url the user passed
		sites.findOne(query, function(e, result) {
			if (e) { throw e 
			} else if (result) {
				callback(result);
			} else {
				console.log("Matching query does not exist");
				callback(null);
			};
		});
	}

	var insertUrl = function(db, paramUrl, callback) {
		// get the sites collection
		console.log("Inserting document...")
		var collection = db.collection('sites');
		// insert the url and a newly generated shorturl
		collection.insert(
			{'original_url': paramUrl,
			'short_url': generateShortUrl()},
			function(e, result) {
				if (e) {throw e};
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
};
app.listen(Number(process.env.PORT || 8000));
