/*var express = require('express');
var app = express();
*/

module.exports = function(app, dbUrl) {
	app.get('/', function(req,res) {
		res.render('index');
	});
};
