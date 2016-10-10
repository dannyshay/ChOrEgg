// server.js

// modules =======================================================
//var express         = require('express');
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var session       = require('express-session');
var MongoStore    = require('connect-mongo')(session);
var mongoose        = require('mongoose');
var cors            = require('cors');
var fs = require('fs')
    , gm = require('gm');

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

// Add CORS support for swagger.io
app.use(cors());

app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: 'thisismysecretpasswordandyoullneverguessit',
    name: 'session',
    proxy: true,
    resave: true,
    saveUninitialized: true}));


// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ========================================================
require('./app/routes')(app);

// start app =====================================================
// startup our app at http://localhost:8080
if(!module.parent) {
    app.listen(port);
}

// shoutout to the user
console.log('App started on port ' + port);

// expose app
exports = module.exports = app;