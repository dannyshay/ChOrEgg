// grab the Item model we created
var Item = require('./models/item');

module.exports = function(app) {
    app.get('/api/items', function(req, res) {
        Item.find(function(err, items) {
            if (err)
                res.send(err);

            res.json(items); //return all items in JSON format
        });
    });

    app.get('/api/items/getCategories', function(req, res) {
        Item.find().distinct('category', function(err, items) {
            if (err)
                res.send(err);

            res.json(items); //return all items in JSON format
        });
    });

    app.get('/api/items/:category', function(req, res) {
        Item.find(function(err, items){
            if (err)
                res.send(err);

            res.json(items);
        }).where({category:req.params.category});
    });

    app.get('/api/items/:category/getCount', function(req, res){
        Item.count({category:req.params.category}, function(err, c){
            res.json(c);
        })
    })

    app.get('/api/items/:category/:itemID', function(req, res) {
       Item.find(function(err, items) {
           if (err)
            res.send(err);

           res.json(items);
       }).where({category:req.params.category, index:parseInt(req.params.itemID)});
    });

    // frontend routes ============================================
    // route to handle all angular requests
    var path = require('path');

    app.get('*', function(req, res) {
       res.sendFile(path.join(__dirname, '../public/index.html')); //load our public/index.html file
    });
};