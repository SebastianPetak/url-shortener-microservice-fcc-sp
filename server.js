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


app.get('/*', function(req,res) {
	var paramUrl = req.url.substr(1);
	console.log("URL Parameter: " + paramUrl);
	if (validUrl.isUri(paramUrl)) {
		console.log("URL is valid");
		paramUrl = normalizeUrl(paramUrl);
		console.log("sending url to api");	
  		api(paramUrl, function() {
		    res.end();
		});
	} else if (paramUrl.match(re)) {
		console.log("URL parameter is a valid short-URL format");
		// find and return document with matching short-URL value
		res.end()
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
	    if (docs.length > 0) {
		console.log("Short URL already exists: " + docs);
		console.log("docs[0] instead: " + docs[0]);
		db.close();	
	    } else {
		console.log("Short URL does not exist"); 
	        insertUrl(db, paramUrl, function(result) {
		    console.log(result)    
		    db.close()
		});
	    };
	});
    });
};

var findUrl = function(db, paramUrl, callback) {
	// get the sites collection
	var collection = db.collection('sites');
	// find documents with url the user passed
	var allSitesArray = collection.find({'url': paramUrl}).toArray()
	if (allSitesArray.length > 0)
	};
};

var insertUrl = function(db, paramUrl, callback) {
	// get the sites collection
	console.log("Inserting document has started")
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
};

var generateShortUrl = function(paramUrl) {
	// return a 8 character string consisting of digits
	return String(Date.now()).slice(-4) + (Math.floor(Math.random() * (999 - 100) + 100));
};
app.listen(Number(process.env.PORT || 8000));
