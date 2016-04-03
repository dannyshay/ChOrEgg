var Item = require('./item');

var utilities = require("./server_utilities");

var handleErrors = function(res, err) {
    if (err)
        res.send(err);
}

var handleErrorsAndItems = function (err, items, res) {
    handleErrors(res, err);

    res.json(items);
}

module.exports = {
    //Global functions

    //getAll - Use this to get all items in the entire database regardless of category
    getAll: function (res) {
        Item.find(function (err, items) {
            handleErrorsAndItems(err, items, res);
        });
    },

    //getCategories - Use this to get the distinct categories in the entire database
    getCategories: function (res) {
        Item.find().distinct('category', function (err, items) {
            handleErrorsAndItems(err, items, res);
        });
    },

    //getDistinctImages - Use this to get all image URLs in the entire database
    getDistinctImages: function (res) {
        Item.find().distinct('image', function (err, items) {
            handleErrorsAndItems(err, items, res);
        });
    },

    //getCountByCategory - Use this to get the total count of all items within a particular category
    getCountByCategory: function (req, res) {
        Item.count({category: req.params.category}, function (err, items) {
            handleErrorsAndItems(err, items, res);
        });
    },

    getByCategory : function (req, res) {
        Item.find(function(err, items){
            handleErrorsAndItems(err, items, res);
        }).where({category:req.params.category});
    },

    getByCategoryAndID : function (req, res) {
        Item.find(function(err, items) {
            handleErrorsAndItems(err, items, res);
        }).where({category:req.params.category, index:parseInt(req.params.itemID)});
    },

    getTwoItems : function (req, res) {
        var category = req.query.category;
        var timeSpan = req.query.timeSpan;

        if (!category) {
            res.send({Error:"Must specify a category."});
            return;
        }

        if (!timeSpan) {
            res.send({Error:"Must specify a timeSpan."});
            return;
        } else {
            timeSpan = parseInt(timeSpan);
        }

        Item.find(function(err, items) {
            handleErrors(res, err);

            Item.count({category: req.query.category}, function (err2, count) {
                handleErrors(res, err2);

                var numItems = parseInt(count);

                var item1 = items[utilities.getRandomInt(1, numItems)];
                var item2 = items[utilities.getRandomInt(1, numItems)];

                while (item2.index == item1.index || Math.abs(item2.date - item1.date) > timeSpan) {
                    item2 = items[utilities.getRandomInt(1, numItems)];
                }

                res.json([item1,item2]);
            });
        }).where({category:req.query.category})
    },

    downloadAndFormatImages: function (res) {
        Item.find(function (err, items) {
            handleErrors(res, err);

            items.forEach(function (myImage) {
                var myImgPath = './public/img/ConvertedImages/' + myImage.category + '/' + myImage.index + '.png';

                download(myImage.image, myImgPath, function () {
                    console.log('Downloaded ' + myImage.image + ' to ' + myImgPath);

                    var myMinImgPath = myImgPath.slice(0, myImgPath.length - 4) + '-min.png';

                    cropImageToBounds(myImgPath, myMinImgPath, 350, 350);
                });
            });

            res.json({successful: true});
        });
    }
}