var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient
	,assert = require('assert');
var dbUrl = 'mongodb://localhost:27017/data';
var url = require('url');
var validUrl = require('valid-url');
const normalizeUrl = require('normalize-url');

var re = new RegExp("^[0-9]{8}$", "g");
// Number(process.env.PORT || 8000);
// MongoClient.connect(process.env.MONGOLAB_URI || dbUrl, function(e, db) { ... copied from somewhere

/*app.get('/favicon.ico', function(req,res) {
	res.sendStatus(200);
	console.log('favicon.ico Requested');
});*/


app.get('/:paramUrl', function(req,res) {
	var paramUrl = req.params.paramUrl;
	console.log("URL Parameter: " + req.params.paramUrl);
	if (validUrl.isUri(paramUrl)) {
		console.log("URL is valid");
		paramUrl = normalizeUrl(paramUrl);
		console.log("about to send url to api");	
  //	api(paramUrl);
	} else if (paramUrl.match(re)) {
		console.log("URL parameter is a valid short-URL format");
		// find and return document with matching short-URL value
	} else {
		console.log("URL parameter is not a valid URL");
		res.end();
	}
});
	

var api = function(paramUrl) {
	MongoClient.connect(dbUrl, function(e, db) {
		assert.equal(e, null);
		console.log("Connected sucessfully to server");
		
		findUrl(db, paramUrl, function(docs) {
			if (docs) {
				insertUrl(db, paramUrl, function() {
					db.close();
				});
			} else { 
				db.close();
			};
		});
	});
};

var findUrl = function(db, paramUrl, callback) {
	// get the sites collection
	var collection = db.collection('sites');
	// find documents with url the user passed
	collection.findOne({'url': paramUrl}, function(e, docs) {
		if (docs[docs.length - 1] != undefined) {
			res.send("Short URL already exists: " + docs);
			callback();
		} else {
			callback(null);	
		}
	})
};

var insertUrl = function(db, paramUrl, callback) {
	// get the sites collection
	var collection = db.collection('sites');
	// insert the url and a newly generated shorturl
	collection.insert(
		{'url': paramUrl,
		'shortUrl': generateShortUrl(paramUrl)},
		function(e, result) {
			assert.equal(e, null);
			assert.equal(1, result.result.n);
			assert.equal(1, result.ops.length);
			if (e == null) {
				console.log("Inserted new url into collection");
			}
			callback(result);
		});
}

var generateShortUrl = function(paramUrl) {
	// return a 8 character string consisting of digits
	return String(Date.now()).slice(-4) + (Math.floor(Math.random() * (999 - 100) + 100));
};
app.listen(Number(process.env.PORT || 8000));
