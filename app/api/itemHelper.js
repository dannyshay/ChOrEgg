var Item = require('./../models/item');
var utilities = require("./server_utilities");
var async = require('async');
var mongoose = require('mongoose');
var rmdir = require('rmdir');

var setVerbs = function (category, items, callback) {
    var verb = "";
    switch (category) {
        case "People":
            verb = "born";
            break;
        default:
            verb = "made";
            break;
    }
    items.forEach(function (item) {
        item.verb = verb
    });

    callback();
};

var getRandomItem = function (items) {
    return items[utilities.getRandomInt(0, items.length - 1)];
};

var processItemsForResponse = function(anItemSet) {
    var retVal = [];

    anItemSet.forEach(function(anItem) {
       retVal.push({
           category: anItem.category,
           date: anItem.date,
           image: anItem.image,
           name: anItem.name
       })
    });

    return retVal;
};

function itemsContainNewItems(newItems, allCurrentItems){
    for(var i = 0; i < newItems.length; i++){
        if(allCurrentItems.indexOf(newItems[i]) === -1)
            return false;
    }
    return true;
}

module.exports = {
    //getAll - Use this to get all items in the entire database regardless of category
    getAll: function (res) {
        Item.find(function (err, items) {
            utilities.handleErrorsAndItems(err, processItemsForResponse(items), res);
        });
    },

    getItemsInTimespan: function(req, res) {
        if (!req.query.category) {
            res.status(400).send({Error: "Must specify a category."});
            return;
        }

        if (!req.query.timeSpan) {
            res.status(400).send({Error: "Must specify a timeSpan."});
            return;
        }

        if (!req.query.numPairs) {
            res.status(400).send({Error: "Must specify numPairs."});
            return;
        }

        var category = req.query.category;
        var timeSpan = parseInt(req.query.timeSpan);
        var numPairs = parseInt(req.query.numPairs);

        var retItems = [];
        var retDict = {};
        var indicies = [];

        for (var i = 0; i < numPairs; i++) {
            indicies.push(i);
        }

        async.forEachOf(indicies, function(myIndex, key, callback2) {
            Item.find(function (err, items) {
                utilities.handleErrors(res, err);

                var item1 = getRandomItem(items);
                var item2 = getRandomItem(items);

                var passedItemCheck = true;
                var itemNames = items.map(function(i) { return i.name });
                if (items.length > 0) { passedItemCheck = !itemsContainNewItems([item1.name, item2.name], itemNames); }

                //Search until we find two items that don't match and meet a few other criteria
                while (retDict[item1.id] != null || retDict[item2.id] != null ||
                item2.id == item1.id || // Don't match
                Math.abs(item2.date - item1.date) >= timeSpan || // Within timespan
                item1.date == item2.date && passedItemCheck) // Not the same year
                {
                    item1 = getRandomItem(items);
                    item2 = getRandomItem(items);
                    if (items.length > 0) { passedItemCheck = !itemsContainNewItems([item1.name, item2.name], itemNames); }
                }

                //Add the items to the id dictionary so we can look them up later
                retDict[item1.id] = item1.id;
                retDict[item2.id] = item2.id;

                async.parallel([
                    function(callback) {setVerbs(category, [item1, item2], callback)},
                    function(callback) {utilities.getImageBase64(item1, item2, null, callback)}
                ], function(err) {
                    retItems.push({itemSet:[item1, item2]});
                    callback2();
                });
            }).where({category: category})
        }, function(err) {
            res.send(retItems);
        });
    },

    downloadAndFormatImages: function (res) {
        Item.find(function (err, items) {
            var startTime = new Date();
            utilities.handleErrors(res, err);

            async.forEachOf(items, function(myImage, key, callback) {
                utilities.createDirectoryIfDoesntExist('./public/assets/ConvertedImages/');
                utilities.createDirectoryIfDoesntExist('./public/assets/ConvertedImages/' + myImage.category);

                var myImgPath = './public/assets/ConvertedImages/' + myImage.category + '/' + myImage.id + '_full.png';

                utilities.download(myImage.image, myImgPath, function () {
                    var myMinImgPath = myImgPath.slice(0, myImgPath.length - 9) + '.jpeg';

                    utilities.cropImageToBounds(myImgPath, myMinImgPath, 350, 350, myImage.id + '.jpeg', callback);
                });
            }, function() {
                rmdir('./public/assets/ConvertedImages');
                var endTime = new Date();
                var totalTime = (endTime - startTime) / 1000;
                console.log('Finished retrieving items - total time: ' + totalTime + ' seconds.');
            });

            res.json({successful: true});
        });
    }
};