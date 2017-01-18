var express = require('express');
var app = express();
var path = require('path');
var dbURL = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data';

var routes = require('./app/routes/index.js');

// set the view engine to ejs
// use res.render to load up an ejs view file
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

routes(app, dbURL);

app.listen(Number(process.env.PORT || 8001));
