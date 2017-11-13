var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./router/index'),
  session = require('express-session');

var path = require('path');
var app = module.exports = express();
var engine = require('ejs-locals');

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + '/'));
app.use('/build', express.static('public'));
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));

var env = process.env.NODE_ENV;
if ('development' == env) {
  app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
}

if ('production' == app.get('env')) {
  app.use(errorHandler());
}

app.use('/', routes);

app.set('port', (process.env.PORT || 8080));

//For avoidong Heroku $PORT error
app.get('/', function (request, response) {
  var result = 'App is running'
  response.send(result);
}).listen(app.get('port'), function () {
  console.log('App is running, server is listening on port ', app.get('port'));
});