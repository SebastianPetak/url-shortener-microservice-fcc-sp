# URL Shortener Microservice

Visit the application [here](https://shurl-sp.herokuapp.com/).

## Goals
* __User Story:__ I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
* __User Story:__ When I visit that shortened URL, it will direct me to my original link.

## Installation

1. Make sure to have [npm](https://www.npmjs.com/) installed.
2. Navigate to the root directory of the application and run `npm install` to install the required modules. There should see a node_modules folder in the root directory.

## Usage

### Starting the server

Start the application with the default the logging settings with `node server.js` or `npm run start`.

### Logging options

Default logging settings include console logging at the debug logging level.  The application requires 4 ARGVs as hashes to define logging settings, for example: `node server.js cl=on fl=off dbl=off ll=debug`.


The logging settings are as follows:
* consoleLogging or _cl_: console logging, on or off.
* fileLogging or _fl_: file logging, on or off.
* dbLogging or _dbl_: database loggin, on or off.
* loggingLevel or _ll_ winston logging level, error or debug.

### Using the API

Example short url creation usage:
* `https://shurl-sp.herokuapp.com/https://www.google.com`


Example short url creation output:
* `{"original_url":"https://google.com","short_url":"5933480"}`


Example of using a short url link:
* `https://shurl-sp.herokuapp.com/5933480`

## Built with

* [Node.js](https://nodejs.org/en/) - platform
* [Express](http://expressjs.com/) - web framework
* [Heroku](https://www.heroku.com/) - cloud application platform
* [mLab](https://mlab.com/) - mongodb hosting
* [bluebird](http://bluebirdjs.com/docs/getting-started.html) - javascript promise library
* [Winston](https://github.com/winstonjs/winston) - logging library
* [yargs](https://www.npmjs.com/package/yargs) - node.js library for parsing arguments

## Author

* [Sebastian Petak](http://www.sebastianpetak.com/)
