//Includes
var itemHelper = require('./api/itemHelper');
var genAPIHelper = require('./api/genAPIHelper');
var difficultyHelper = require('./api/difficultyHelper');
var categoryHelper = require('./api/categoryHelper');
var userHelper = require('./api/userHelper');
var adminHelper = require('./api/adminHelper');

//API Calls
module.exports = function(app) {
    //General Functions
    app.get('/api/getEnvironment', function(req, res) {
        res.send({environment: process.env['mode'] || 'LOCAL'});
    });

    app.get('/api/downloadAndFormatImages', function(req, res) {
        itemHelper.downloadAndFormatImages(res);
    });

    //User Functions
    app.get('/api/users', function(req, res) {
       userHelper.getAll(res);
    });

    app.post('/api/users', function(req, res) {
        userHelper.addUser(req, res);
    });

    app.put('/api/users', function(req, res) {
        userHelper.updateUser(req, res);
    });

    app.get('/api/users/getUsersByHighScore', function(req, res) {
       userHelper.getUsersByHighScore(req, res);
    });

    app.delete('/api/users/:username', function(req, res) {
        userHelper.deleteUser(req, res);
    });

    app.get('/api/users/:username', function(req, res) {
        userHelper.getUser(req, res);
    });

    app.get('/api/difficulties', function(req, res) {
        difficultyHelper.getAll(res);
    });

    app.get('/api/getImage', function(req, res) {
       genAPIHelper.getImage(req, res);
    });

    app.get('/api/items/deleteAllItems', function(req, res) {
        itemHelper.deleteAllItems(req, res);
    });

    //Item Functions
    app.get('/api/items', function(req, res) {
        itemHelper.getAll(res);
    });

    app.post('/api/items/addItems', function(req, res) {
        itemHelper.addItems(req, res);
    });

    app.get('/api/categories', function(req, res) {
        categoryHelper.getCategories(res);
    });

    app.get('/api/items/getItemsInTimespan', function(req, res) {
       itemHelper.getItemsInTimespan(req, res);
    });

    //Admin Functions
    app.post('/api/admin/postFile', function(req, res) {
        adminHelper.postFile(req, res);
    });

    // frontend routes ============================================
    // route to handle all angular requests
    var path = require('path');

    app.get('/swagger/yaml', function(req, res) {
       res.sendFile(path.join(__dirname, '../api.yaml'));
    });

    app.get('/swagger', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/swagger/index.html'));
    });

    app.get('*', function(req, res) {
       res.sendFile(path.join(__dirname, '../public/index.html')); //load our public/index.html file
    });
};