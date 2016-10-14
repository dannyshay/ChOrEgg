// server.js

// modules =======================================================
var express = require('express');
var app = express();
var http = require('http');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var cors = require('cors');
var fs = require('fs')
var gm = require('gm');

// configuration =================================================

// config files
var db = require('./config/db');

app.use('/js', express.static(__dirname + '/js'));
app.use('/bower_components', express.static(__dirname + '/../bower_components'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/partials', express.static(__dirname + '/partials'));

// set our port
var port = process.env.PORT || 8080;

var mode = process.env['mode'] || 'LOCAL';
console.log('Current environment: ' + mode);

// connect to our mongoDB database
mongoose.connect(db.url);

// setup mongo session
app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: 'thisismysecretpasswordandyoullneverguessit',
    name: 'session',
    proxy: true,
    resave: true,
    saveUninitialized: true}));

// socket.io setup
var server = http.createServer(app);
var io = socketio.listen(server);
app.set('socketio', io);
app.set('server', server);

// Add CORS support for swagger.io
app.use(cors());

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// limit incoming requests to 50mb
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location
app.use(express.static(__dirname + '/public'));

// routes ========================================================
require('./app/routes')(app);

// start app =====================================================
// startup our app at http://localhost:8080
if(!module.parent) {
    app.get('server').listen(port);
}

// shoutout to the user
console.log('App started on port ' + port);

// expose app
exports = module.exports = app;