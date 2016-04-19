var Item = require('./../models/item');
var async = require('async');
var utilities = require("./server_utilities");
var genAPIHelper = require('./genAPIHelper');
var mongoose = require('mongoose');
var fs = require('fs');
var request = require('request');
var Grid = require('gridfs-stream');
var db = require('../../config/db');
Grid.mongo = mongoose.mongo;


var setVerbs = function (category, items, callback) {
    var verb = ""
    switch (category) {
        case "People":
            verb = "born"
            break;
        default:
            verb = "made"
            break;
    }
    items.forEach(function (item) {
        item.verb = verb
    });

    callback();
}

var getRandomItem = function (items) {
    return items[utilities.getRandomInt(0, items.length - 1)];
}

var checkRequiredVariables = function (req, res) {
    if (!req.query.category) {
        res.send({Error: "Must specify a category."});
        return;
    }

    if (!req.query.timeSpan) {
        res.send({Error: "Must specify a timeSpan."});
        return;
    }
};

module.exports = {
    //Global functions

    //getAll - Use this to get all items in the entire database regardless of category
    getAll: function (res) {
        Item.find(function (err, items) {
            utilities.handleErrorsAndItems(err, items, res);
        });
    },

    //getCategories - Use this to get the distinct categories in the entire database
    getCategories: function (res) {
        Item.find().distinct('category', function (err, items) {
            utilities.handleErrors(res, err);

            res.send({Categories: items});
        });
    },

    //getDistinctImages - Use this to get all image URLs in the entire database
    getDistinctImages: function (res) {
        Item.find().distinct('image', function (err, items) {
            utilities.handleErrorsAndItems(err, items, res);
        });
    },

    //getCountByCategory - Use this to get the total count of all items within a particular category
    getCountByCategory: function (req, res) {
        Item.count({category: req.params.category}, function (err, items) {
            utilities.handleErrorsAndItems(err, items, res);
        });
    },

    getByCategory: function (req, res) {
        Item.find(function (err, items) {
            utilities.handleErrorsAndItems(err, items, res);
        }).where({category: req.params.category});
    },

    getByCategoryAndID: function (req, res) {
        Item.find(function (err, items) {
            utilities.handleErrorsAndItems(err, items, res);
        }).where({category: req.params.category, _id: mongoose.Types.ObjectId(req.params.id)});
    },

    getTwoItemsInTimespan: function (req, res) {
        checkRequiredVariables(req, res);

        var category = req.query.category;
        var timeSpan = parseInt(req.query.timeSpan);

        var oldItem1ID = (req.query.oldID1 ? req.query.oldID1 : 0);
        var oldItem2ID = (req.query.oldID2 ? req.query.oldID2 : 0);

        Item.find(function (err, items) {
            utilities.handleErrors(res, err);

            var item1 = getRandomItem(items);
            var item2 = getRandomItem(items);

            //Search until we find two items that don't match and meet a few other criteria
            while (
            item2.id == item1.id || // Don't match
            Math.abs(item2.date - item1.date) > timeSpan || // Within timespan
            item1.date == item2.date || // Not the same year
            (oldItem1ID != 0 && (item1.id == oldItem1ID || item2.id == oldItem1ID)) || //Not an item we had before (top)
            (oldItem2ID != 0 && (item1.id == oldItem2ID || item2.id == oldItem2ID))) { //Not an item we had before (bottom)
                item1 = getRandomItem(items);
                item2 = getRandomItem(items);
            }

            async.parallel([
                function(callback) {setVerbs(category, [item1, item2], callback)},
                function(callback) {utilities.getImageBase64(item1, item2, null, callback)}
            ], function(err) {res.send({Items:[item1, item2]})});
        }).where({category: category})
    },

    downloadAndFormatImages: function (res) {
        Item.find(function (err, items) {
            utilities.handleErrors(res, err);

            async.forEachOf(items, function(myImage, key, callback) {
                utilities.createDirectoryIfDoesntExist('./public/assets/ConvertedImages/');
                utilities.createDirectoryIfDoesntExist('./public/assets/ConvertedImages/' + myImage.category);

                var myImgPath = './public/assets/ConvertedImages/' + myImage.category + '/' + myImage.id + '_full.png';

                utilities.download(myImage.image, myImgPath, function () {
                    var myMinImgPath = myImgPath.slice(0, myImgPath.length - 9) + '.jpeg';

                    utilities.cropImageToBounds(myImgPath, myMinImgPath, 350, 350, myImage.id + '.jpeg');
                });

                callback();
            }, function() {
                res.json({successful: true});
            });
        });
    }
}