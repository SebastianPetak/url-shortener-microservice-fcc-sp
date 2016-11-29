var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient
	,assert = require('assert');
var dbUrl = 'mongodb://localhost:27017/data';
var url = require('url');
var validUrl = require('valid-url');
const normalizeUrl = require('normalize-url');

var re = new RegExp("^[0-9]{7}$", "g");
// Number(process.env.PORT || 8000);
// MongoClient.connect(process.env.MONGOLAB_URI || dbUrl, function(e, db) { ... copied from somewhere

/*app.get('/favicon.ico', function(req,res) {
	res.sendStatus(200);
	console.log('favicon.ico Requested');
});*/


app.get('/*', function(req,res) {
	var paramUrl = req.url.substr(1);
	console.log("req.url.substr(1): " + req.url.substr(1));
	console.log("req.url: " + req.url);
	console.log("URL Parameter: " + paramUrl);
	if (validUrl.isUri(paramUrl)) {
		console.log("URL is valid");
		paramUrl = normalizeUrl(paramUrl);
		console.log("normalized url: " + paramUrl);
		console.log("sending url to api");	
  		originalURLHandler(paramUrl, function(response) {
		    console.log(response)
			res.end();
			console.log("response has ended");
		});
	} else if (paramUrl.match(re)) {
		console.log("URL parameter is a valid short-URL format");
		// find and return document with matching short-URL value
		shortURLHandler(paramUrl, function(response) {
			console.log(response);
			res.end();
		});
	} else {
		console.log("URL parameter is not a valid URL");
		res.end();
	}
});
	

var originalURLHandler = function(paramUrl, callback) {
    MongoClient.connect(dbUrl, function(e, db) {
		assert.equal(e, null);
		console.log("Successfully connected to server");
		findUrl(db,"original_url", paramUrl, function(result) {
			if (result) {
				var response = "URL already exists in database:\n"
					+ JSON.stringify({
						original_url: result.original_url,
						short_url: result.short_url
					});
				db.close();
				console.log("database closed");
				callback(response);
			} else {
				console.log("New URL being send to insertUrl");
				insertUrl(db, paramUrl, function(result) {
					var response = "New data inserted into database:\n " 
						+ JSON.stringify({
							original_url: result.ops[0].original_url,
							short_url: result.ops[0].short_url
						});
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
		console.log("Successfully connected to server");
		findUrl(db, "short_url", paramUrl, function(result) {
			if (result) {
				var response = "Short URL exists:\n"
				+ JSON.stringify({
					original_url: result.original_url,
					short_url: result.short_url
				});
				db.close();
				console.log("database closed");
				callback(response);
			} else {
				var response = "Short URL does not exist in the database";
				db.close();
				console.log("database closed");
				callback(response);
			}
		});
	});
};

var findUrl = function(db, key, paramUrl, callback) {
	console.log("findUrl has started");
	// get the sites collection
	var sites = db.collection('sites');
	// set key for findOne function
	query = {};
	query[key] = paramUrl;
	// find documents with url the user passed
	console.log("This is paramUrl going into findOne: " + paramUrl);
	sites.findOne(query, function(e, result) {
		console.log("sites.findOne callback has begun with result == " + result);
		if (e) { throw e 
		} else if (result) {
			console.log("This is result: " + result);
			console.log("This is result[result.length - 1]: " + result[result.length -1]);
			console.log("This is result.url: " + result.original_url);
			console.log("This is JSON.stringify(result): " + JSON.stringify(result));
			callback(result);
		} else {
			console.log("result didn't exist");
			callback(null);
		};
	});
}

var insertUrl = function(db, paramUrl, callback) {
	// get the sites collection
	console.log("Inserting document has started")
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
			console.log("this is JSON.stringify(result) after insert: " + JSON.stringify(result))
			callback(result);
		});
};

var generateShortUrl = function() {
	// return a 8 character string consisting of digits
	return String(Date.now()).slice(-4) + (Math.floor(Math.random() * (999 - 100) + 100));
};
app.listen(Number(process.env.PORT || 8000));
