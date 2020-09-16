var Item = require('./../models/item');
var utilities = require("./server_utilities");
var async = require('async');
var mongoose = require('mongoose');
//var rmdir = require('rmdir');
var fs = require('fs');
var Grid = require('gridfs-stream');
var db = require('../../config/db');
Grid.mongo = mongoose.mongo;

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
           front: anItem.front,
           back: anItem.back
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
    deleteAllItems: function(req, res) {
        var environment = ((req.query.environment) ? req.query.environment : 'LOCAL');
        console.log(environment);
        switch (environment) {
            case 'LOCAL':
                mongoose.connection.db.dropCollection('items');
                mongoose.connection.db.dropCollection('fs.files');
                mongoose.connection.db.dropCollection('fs.chunks');

                res.send({Message: "Items deleted successfully"});
                break;
            default:
                var MongoClient = require('mongodb').MongoClient;

                var url = null;

                if (environment == 'DEV') {
                    url = 'mongodb://app_choregg_dev:fHK2NxT5CrGZSFvS@ds015780.mlab.com:15780/heroku_l6cnt4kv';
                } else if (environment == 'QA') {
                    url = 'mongodb://app_choregg_qa:BCSkpQ5dDHwZRe4X@ds031978.mlab.com:31978/heroku_fbw36qss';
                } else if (environment == 'PROD') {
                    url = 'mongodb://app_choregg:pJkAc2THuFWE6nUb@ds015939.mlab.com:15939/heroku_9nm45jhg';
                } else {
                    throw new Error('Invalid environment to delete');
                }

                // Connect to the db
                MongoClient.connect(url, function(err, db) {
                    if(!err) {
                        db.dropCollection('items');
                        db.dropCollection('fs.files');
                        db.dropCollection('fs.chunks');

                        res.send({Message: 'Items deleted successfully'});
                    } else {
                        res.send({Error: err});
                    }
                });

                break;
        }
    },
    addItems: function(req, res) {
        var items = req.body;
        if (items == null || items == undefined || items.length == 0) {
            res.status(400).send({Error: "Must sepcify items."})
            return;
        }

        Item.insertMany(items, function(err) {
            if (err) {
                res.status(500).send({Error: err});
            } else {
                res.send({Message: "Items added successfully"});
            }
        });
    },
    syncItemsFromLocalMongo: function(req, res) {
        var environment = req.query.environment;
        console.log('environment = ' + req.query.environment);

        async.series([
            function(callback) {
                utilities.dumpCollection('items', callback);
            },
            function(callback) {
                utilities.dumpCollection('fs.files', callback);
            },
            function(callback) {
                utilities.dumpCollection('fs.chunks', callback);
            }
        ], function(err) {
            if (err) {
                res.status(400).send({Error: error});
                return;
            }

            if (!req.query.environment) {
                res.status(400).send({Error: "No environment specified"});
                return;
            }

            async.series([
                function(callback) {
                    utilities.restoreCollection(environment, 'items', callback);
                },
                function(callback) {
                    utilities.restoreCollection(environment, 'fs.files', callback);
                },
                function(callback) {
                    utilities.restoreCollection(environment, 'fs.chunks', callback);
                }
            ], function(err2) {
                if (err2) {
                    res.status(400).send({Error: err2});
                    return;
                }

                utilities.deleteFolderRecursive('./dump');

                res.send({Message: "All items restored"});
            });


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
                var itemNames = (req.query.anOldItemSet ? req.query.anOldItemSet : []);

                if (itemNames && itemNames.length > 0) { passedItemCheck = !itemsContainNewItems([item1.name, item2.name], itemNames); }

                //Search until we find two items that don't match and meet a few other criteria
                while (retDict[item1.id] != null || retDict[item2.id] != null ||
                item2.id == item1.id || // Don't match
                Math.abs(item2.date - item1.date) >= timeSpan || // Within timespan
                item1.date == item2.date && passedItemCheck) // Not the same year
                {
                    item1 = getRandomItem(items);
                    item2 = getRandomItem(items);
                    if (itemNames && itemNames.length > 0) { passedItemCheck = !itemsContainNewItems([item1.name, item2.name], itemNames); }
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

    downloadAndFormatImages: function (req, res) {
        Item.find(function (err, items) {
            var socketio = req.app.get('socketio');
            var startTime = new Date();
            utilities.handleErrors(res, err);

            var count = 0;
            var itemCount = items.length;
            var currentCompleted = 0;

            console.log('Downloading Images...............');
            socketio.sockets.emit('downloading', true);

            async.forEachOfLimit(items, 500, function(myImage, key, callback) {
                utilities.createDirectoryIfDoesntExist('./public/assets/ConvertedImages/');
                utilities.createDirectoryIfDoesntExist('./public/assets/ConvertedImages/' + myImage.category);

                var myImgPath = './public/assets/ConvertedImages/' + myImage.category + '/' + myImage.id + '_full.png';

                utilities.download(myImage.image, myImgPath, function () {
                    var myMinImgPath = myImgPath.slice(0, myImgPath.length - 9) + '.jpeg';

                    utilities.cropImageToBounds(myImgPath, myMinImgPath, 350, 350, myImage.id + '.jpeg', callback);

                    count++;
                    var newCurrentCompleted = (count / itemCount).toFixed(2);

                    if (newCurrentCompleted != currentCompleted) {
                        currentCompleted = newCurrentCompleted;
                        var progress = currentCompleted.replace("0.0","").replace("0.","").replace("1.00","100") + '% completed.';
                        socketio.sockets.emit('downloadProgressUpdate', progress);
                    }
                });
            }, function() {
                fs.rmDir('./public/assets/ConvertedImages');
                var endTime = new Date();
                var totalTime = (endTime - startTime) / 1000;
                console.log('Finished retrieving items - total time: ' + totalTime + ' seconds.');
                socketio.sockets.emit('imagesDownloadedUpdated', true);
            });

            res.json({successful: true});
        });
    }
};
