'use strict';
var express = require('express');
var app = express();
global.Promise = require('bluebird');
var winston = require('winston');
require('winston-mongodb').MongoDB;
var path = require('path');
var dbURL = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data';
// Logging options
var argv = require('yargs')
	.demandOption(['consoleLogging', 'fileLogging', 'dbLogging', 'loggingLevel'])
	.option('consoleLogging', {
		alias: 'cl',
		describe: 'console logging, on or off',
		choices: ['on', 'off'],
		default: 'on'
	})
	.option('fileLogging', {
		alias: 'fl',
		describe: 'file logging, on or off',
		choices: ['on', 'off'],
		default: 'off'
	})
	.option('dbLogging', {
		alias: 'dbl',
		describe: 'database logging, on or off',
		choices: ['on', 'off'],
		default: 'off'
	})
	.option('loggingLevel', {
		alias: 'll',
		describe: 'winston logging level, error or debug',
		choices: ['error', 'debug'],
		default: 'debug'
	})
	.argv;

/* Configuration for logging via winston.
	 Switch on or off console, file, and database logging independently.
	 Select level of logging, debug (default) or error.
*/
if (argv.consoleLogging == 'off') {
	winston.remove(winston.transports.Console);
}
if (argv.fileLogging == 'on') {
	winston.add(winston.transports.File, { filename: 'winston.log' });
}
if (argv.dbLogging == 'on') {
	winston.add(winston.transports.MongoDB, {db: dbURL,
		collection: 'urlShortenerLogs'});
}
switch(argv.loggingLevel) {
case 'error':
	winston.level = 'error';
	break;
case 'debug':
	winston.level = 'debug';
}

winston.log('info', 'Application executed with the following logging settings:\n' +
	'\tConsole logging: ' + argv.consoleLogging + '\n' +
	'\tFile logging: ' + '\t ' + argv.fileLogging + '\n' +
	'\tDatabase loggin: ' + argv.dbLogging + '\n' +
	'\tLogging level: ' + '\t ' + argv.loggingLevel
);

var routes = require('./app/routes/index.js');

// set the view engine to ejs
// use res.render to load up an ejs view file
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

routes(app, dbURL);

app.listen(Number(process.env.PORT || 8001));
