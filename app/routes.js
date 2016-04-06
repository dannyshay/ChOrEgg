//Includes
var itemHelper = require('./models/itemHelper')
var genAPIHelper = require('./models/genAPIHelper')

//API Calls
module.exports = function(app) {
    //General Functions
    app.get('/api/downloadAndFormatImages', function(req, res) {
        itemHelper.downloadAndFormatImages(res);
    });

    //User Functions
    app.get('/api/user/getScore', function(req, res) {
       res.json((req.session.score == undefined ? 0 : parseInt(req.session.score)));
    });

    app.get('/api/difficulties', function(req, res) {
        genAPIHelper.getAll(res);
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
        itemHelper.getCategories(res);
    });

    app.get('/api/items/getTwoItemsInTimespan', function(req, res) {
        itemHelper.getTwoItemsInTimespan(req, res);
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