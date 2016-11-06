var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dburl = 'mongodb://localhost:27017/data';
var url = require('url');
var validUrl = require('valid-url');
// Number(process.env.PORT || 8000);

mongo.MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener', function(e, db) {

	db.createCollection("sites", {
		capped: true,
		size: 5242880,
		max: 5000
	});

	function addShortURL(paramURL) {
		MongoClient.connect(dburl, function(e, db) {
			if (e) {
				console.log('Unable to connect tot he mongoDB server. Error:', e);
			} else {
				console.log('Connection established to', url);
				var collection = db.collection('urls')
				collection.insert(
				db.close();
			}
		});
	}
	app.get('/:paramURL', function(req,res) {
		var paramURL = req.params.paramURL;
		if (validUrl.isUri(paramURL)) {
			console.log(("URL is valid");
			addShortURL(paramURL);
		} else {
			console.log("Not a valid URL");
		})
	})
})
app.listen(Number(process.env.PORT || 8000);
