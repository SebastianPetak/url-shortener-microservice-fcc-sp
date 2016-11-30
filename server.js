//require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient
	,assert = require('assert');
var dbUrl = process.env.MONGOLAB_URI// || 'mongodb://localhost:27017/data';
var url = require('url');
var validUrl = require('valid-url');
const normalizeUrl = require('normalize-url');

var api = require('./app/api/url-shortener.js');
var routes = require('./app/routes/index.js');

// set the view engine to ejs
// use res.render to load up an ejs view file
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

routes(app, dbUrl);
api(app, dbUrl);

app.listen(Number(process.env.PORT || 8001));
