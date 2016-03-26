// grab the Item model we created
var Item = require('./models/item');

var fs = require('fs')
    , gm = require('gm');

var request = require('request');

module.exports = function(app) {
    app.get('/api/items', function(req, res) {
        Item.find(function(err, items) {
            if (err)
                res.send(err);

            res.error = false;

            res.json(items); //return all items in JSON format
        });
    });

    app.get('/api/items/categories', function(req, res) {
        Item.find().distinct('category', function(err, items) {
            if (err)
                res.send(err);

            res.json(items); //return all items in JSON format
        });
    });

    app.get('/api/items/:category/count', function(req, res){
        Item.count({category:req.params.category}, function(err, c){
            res.json(c);
        })
    })

    app.get('/api/items/:category', function(req, res) {
        Item.find(function(err, items){
            if (err)
                res.send(err);

            res.json(items);
        }).where({category:req.params.category});
    });

    app.get('/api/items/:category/:itemID', function(req, res) {
       Item.find(function(err, items) {
           if (err)
            res.send(err);

           res.json(items);
       }).where({category:req.params.category, index:parseInt(req.params.itemID)});
    });

    app.get('/api/items/:category/:itemID/formatted', function(req, res) {
        Item.find(function(err, items) {
            if (err) {res.send(err);}

            var myImage = items[0];

            var myImgPath = './public/img/ConvertedImages/' +  myImage.category + '/' + myImage.index + '.png'

            download(myImage.image, myImgPath,function() {
                console.log('Downloaded ' + myImage.image + ' to ' + myImgPath);

                var myMinImgPath = myImgPath.slice(0,myImgPath.length - 4) + '-min.png';

                gm(myImgPath)
                    .resize(240,240,'!')
                    .write(myMinImgPath, function (err) {
                        if (!err) console.log('done');
                        if (err) console.log(err);
                    });

                var path = require('path');

                //res.redirect('../' + myMinImgPath);
                res.redirect('localhost:8080/public/img/ConvertedImages/People/1-min.png');
            });
        }).where({category:req.params.category, index:parseInt(req.params.itemID)});
    });

    // frontend routes ============================================
    // route to handle all angular requests
    var path = require('path');

    app.get('*', function(req, res) {
        res.body.error = false;
       res.sendFile(path.join(__dirname, '../public/index.html')); //load our public/index.html file
    });
};

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};