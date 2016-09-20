var utilities = require("./server_utilities");
var User = require('./../models/user');
var async = require('async');
var deferred = require('deferred');

var updateUserInMongo = function(aUser) {
    var myDeferred = deferred();

    User.findOneAndUpdate({username:aUser.username}, {$set: {highScore: aUser.highScore, createdDate: aUser.createdDate, lastSignInDate: aUser.lastSignInDate, totalRoundsPlayed: aUser.totalRoundsPlayed}}, {new:true}, function(err, doc) {
        myDeferred.resolve(aUser);
    });

    return myDeferred.promise();
};

var addUserToMongo = function(aFoundUser) {
    var myDeferred = deferred();
    var myUser = new User();

    myUser.username = aFoundUser.username;
    myUser.createdDate = aFoundUser.createdDate;
    myUser.lastSignInDate = aFoundUser.lastSignInDate;
    myUser.highScore = aFoundUser.highScore;
    myUser.totalRoundsPlay = aFoundUser.totalRoundsPlayed;

    myUser.save();

    myDeferred.resolve(myUser);
    return myDeferred.promise();
};

var deleteUserFromMongo = function(aFoundUser) {
    var myDeferred = deferred();

    aFoundUser.remove();

    myDeferred.resolve();
    return myDeferred.promise();
};

var findSpecificUser = function(aUsername) {
    var myDeferred = deferred();
    User.find(function (err, users) {
        myDeferred.resolve(users[0]);
    }).where({username: aUsername});

    return myDeferred.promise();
};

var processUsersForResponse = function(aListOfUsers) {
    var retVal = [];

    if (!aListOfUsers || aListOfUsers == undefined) { return retVal; }

    aListOfUsers.forEach(function(aUser) {
        var myUser = {
            username: aUser.username,
            createdDate: aUser.createdDate,
            lastSignInDate: aUser.lastSignInDate,
            highScore: aUser.highScore,
            totalRoundsPlayed: aUser.totalRoundsPlayed
        }
        retVal.push(myUser);
    });

    return retVal;
};

module.exports = {
    getAll: function (res) {
        User.find(function (err, users) {
            res.status(200).send(processUsersForResponse(users));
        });
    },
    getUser: function(req, res) {
        if (!req.params.username) {
            res.status(400).send({Error: 'Must specify a username'});
        } else {
            findSpecificUser(req.params.username).then(function(aFoundUser) {
                if (aFoundUser == undefined) {
                    res.status(200).send([]);
                } else {
                    res.status(200).send(processUsersForResponse([aFoundUser])[0]);
                }
            });
        }
    },
    addUser: function(req, res) {
        var aUsername = req.body.username;
        if(!aUsername)
            res.status(400).send({Error:'Must specify a username'});

        findSpecificUser(aUsername).then(function(aFoundUser) {
            // We did not find an existing user - create a new one
            if(aFoundUser == null) {
                addUserToMongo({username: aUsername, createdDate: req.body.createdDate, lastSignInDate: req.body.lastSignInDate, highScore: req.body.highScore, totalRoundsPlay: req.body.totalRoundsPlay}).then(function(anAddedUser) {
                    res.status(201).send(processUsersForResponse([anAddedUser])[0]);
                });
            } else {
                // We found an existing user and want to send a message back
                res.status(409).send({Error: 'User already exists. To update an existing user - try this request as PUT instead of POST'});
            }
        });
    },
    updateUser: function(req, res) {
        var aUsername = req.body.username;
        if(!aUsername)
            res.status(400).send({Error:"Must specify a username."});

        findSpecificUser(aUsername).then(function(aFoundUser) {
            if(aFoundUser != null && aFoundUser.username == aUsername) {
                var myRequestUser = {
                    username: req.body.username,
                    createdDate: req.body.createdDate,
                    lastSignInDate: req.body.lastSignInDate,
                    highScore: req.body.highScore,
                    totalRoundsPlayed: req.body.totalRoundsPlayed
                };
                updateUserInMongo(myRequestUser).then(function(anUpdatedUser) {
                   res.status(200).send(processUsersForResponse([anUpdatedUser])[0]);
                });
            } else {
                res.status(404).send({Error: "No user found to update with username = " + aUsername});
            }
        });
    },
    deleteUser: function(req, res) {
        var aUsername = req.params.username;
        if(!aUsername)
            res.status(400).send({Error:'Must specify a username'});

        findSpecificUser(aUsername).then(function(aFoundUser) {
           if(aFoundUser != null && aFoundUser.username == aUsername) {
                deleteUserFromMongo(aFoundUser).then(function() {
                    res.status(200).send();
                });
           }  else {
               res.status(404).send({Error: 'No user found to delete with a username = ' + aUsername});
           }
        });
    },
    getUsersByHighScore: function(req, res) {
        var numUsers = req.query.numUsers;
        if(!numUsers || !numUsers > 0)
            res.status(400).send({Error:'Must specify number of users (numUsers)'});

        User
            .find(function(err, users){
                if(err)
                    res.status(400).send({Error: err});

                res.status(200).send(processUsersForResponse(users));
            })
            .sort({highScore:-1})
            .limit(parseInt(numUsers));

    }
};