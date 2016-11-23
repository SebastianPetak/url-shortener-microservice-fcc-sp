var validUrl = require('valid-url');

if (validUrl.isUri(process.argv[2])) {
	console.log("is a valid URL");
} else {
	console.log("IS NOT a valid URL");
};
