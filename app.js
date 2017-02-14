// app.js

// modules =======================================================
var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var cors = require('cors');
var logger = require('morgan');
var favicon = require('serve-favicon');

// configuration =================================================
if (!process.env['mode']) { process.env['mode'] = 'LOCAL'; }

// config files
mongoose.connect(require('./config/db').url);

//modules
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); //CORS support for swagger.io

//mongo session
app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: 'thisismysecretpasswordandyoullneverguessit',
    name: 'session',
    proxy: true,
    resave: true,
    saveUninitialized: true}));

// routes ========================================================
require('./app/routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;