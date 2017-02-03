var express = require('express');
var app = express();
var winston = require('winston');
require('winston-mongodb').MongoDB;
var path = require('path');

// give this it's own object
var dbURL = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data';
var consoleLogging = process.env.CONSOLE_LOGGING || process.argv[2] || 'on';
var fileLogging = process.env.FILE_LOGGING || process.argv[3] || 'off';
var DBLogging = process.env.DBLOGGING || process.argv[4] || 'off';
var loggingLevel = process.env.LOGGING_LEVEL || process.argv[5] || 'debug';

if (consoleLogging == 'off') {
	winston.remove(winston.transports.Console);
}
if (fileLogging == 'on') {
	winston.add(winston.transports.File, { filename: 'winston.log' });
}
if (DBLogging == 'on') {
	winston.add(winston.transports.MongoDB, {db: dbURL,
		collection: 'urlShortenerLogs'});
}
if (loggingLevel == 'error') {
	winston.level = 'error';
}

var routes = require('./app/routes/index.js');

// set the view engine to ejs
// use res.render to load up an ejs view file
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

routes(app, dbURL);

app.listen(Number(process.env.PORT || 8001));
