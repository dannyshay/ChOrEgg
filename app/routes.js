//Includes
var itemHelper = require('./api/itemHelper');
var genAPIHelper = require('./api/genAPIHelper');
var difficultyHelper = require('./api/difficultyHelper');
var categoryHelper = require('./api/categoryHelper');
var userHelper = require('./api/userHelper');

//API Calls
module.exports = function(app) {
    //General Functions
    app.get('/api/downloadAndFormatImages', function(req, res) {
        itemHelper.downloadAndFormatImages(res);
    });

    //User Functions
    app.get('/api/users', function(req, res) {
       userHelper.getUsers(res);
    });

    app.get('/api/difficulties', function(req, res) {
        difficultyHelper.getAll(res);
    });

    app.get('/api/getImage', function(req, res) {
       genAPIHelper.getImage(req, res);
    });

    //Item Functions
    app.get('/api/items', function(req, res) {
        itemHelper.getAll(res);
    });

    app.get('/api/items/images', function(req, res) {
        itemHelper.getDistinctImages(res);
    });

    app.get('/api/items/categories', function(req, res) {
        categoryHelper.getCategories(res);
    });

    app.get('/api/items/getItemsInTimespan', function(req, res) {
       itemHelper.getItemsInTimespan(req, res);
    });

    app.get('/api/items/:category/count', function(req, res){
        itemHelper.getCountByCategory(req, res);
    });

    app.get('/api/items/:category', function(req, res) {
        itemHelper.getByCategory(req, res);
    });

    app.get('/api/items/:category/:id', function(req, res) {
       itemHelper.getByCategoryAndID(req, res);
    });

    // frontend routes ============================================
    // route to handle all angular requests
    var path = require('path');

    app.get('*', function(req, res) {
       res.sendFile(path.join(__dirname, '../public/index.html')); //load our public/index.html file
    });
};