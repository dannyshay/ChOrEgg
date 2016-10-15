var request = require('request');
var fs = require('fs');
var gm = require('gm');
var spawn = require('child_process').spawn;
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var db = require('../../config/db');
Grid.mongo = mongoose.mongo;

var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = {
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    download: function (uri, filename, callback) {
        if (uri == null || uri == undefined) {
            throw new Error(filename + ' bad image - need to update master list.');
        }
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    },

    cropImageToBounds: function (myImgPath, myMinImgPath, width, height, imgName, anAsyncCallback) {
        var myFunction = function (anImgName, aMinImgPath, aGfs, aCallBack) {
            var writestream = aGfs.createWriteStream({
                filename: anImgName
            });
            var stream = fs.createReadStream(aMinImgPath);
            stream.pipe(writestream);
            stream.on('close', function () {
                fs.unlink(aMinImgPath);
                aCallBack();
            });
        };

        try {
            fs.accessSync(myImgPath, fs.F_OK);

            gm(myImgPath)
                .resize(width, height, '^')
                .gravity('Center')
                .crop(width, height)
                .compress('jpeg')
                .write(myMinImgPath, function (err) {
                    if (err) console.log(err);
                    fs.unlink(myImgPath);

                    var gfs = Grid(mongoose.connection.db, mongoose.mongo);

                    gfs.exist({filename: imgName}, function (err, found) {
                        if (found) {
                            gfs.remove({filename: imgName}, function (err) {
                                if (err) return err;
                                myFunction(imgName, myMinImgPath, gfs, anAsyncCallback);
                            });
                        } else {
                            myFunction(imgName, myMinImgPath, gfs, anAsyncCallback);
                        }

                    });
                });
        } catch (e) {
            // It isn't accessible
            throw new Error(imgName + ' bad image - need to update master list.');
        }
    },

    createDirectoryIfDoesntExist: function (directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
    },

    getImageBase64: function (item1, item2, res, callback) {
        var filename = item1._id + '.jpeg';
        var filename2 = (item2 ? item2._id + '.jpeg' : "");

        var conn = mongoose.createConnection(db.url);
        conn.once('open', function () {
            var gfs = Grid(conn.db, mongoose.mongo);

            var readStream = gfs.createReadStream({filename: filename});

            var readStream2 = (filename2 != "" ? gfs.createReadStream({filename: filename2}) : "");

            var bufs = [];
            var bufs2 = [];

            readStream.on('data', function (chunk) {
                bufs.push(chunk);
            }).on('end', function () {
                var fbuf = Buffer.concat(bufs);

                var base64 = (fbuf.toString('base64'));

                if (readStream2 != "") {
                    readStream2.on('data', function (chunk) {
                        bufs2.push(chunk);
                    }).on('end', function () {
                        fbuf = Buffer.concat(bufs2);

                        var base642 = (fbuf.toString('base64'));
                        var retVal = [base64, base642];

                        if (res) {
                            res.send(retVal);

                        } else {

                            item1.imageData = base64;
                            item2.imageData = base642;
                            callback();
                        }
                    })
                } else {
                    if (res) {
                        res.send(base64);

                    } else {

                        item1.imageData = base64;
                        callback();
                    }
                }
            });
        });
    },

    dumpCollection: function(collectionName, aCallback) {
        var args = ['--db', 'choregg', '--collection', collectionName]
            , mongodump = spawn('/usr/local/bin/mongodump', args);

        mongodump.stdout.on('data', function (data) {
            return;
        });
        mongodump.stderr.on('data', function (data) {
            return;
        });
        mongodump.on('exit', function (code) {
            aCallback();
            return;
        });
    },

    restoreCollection: function(environment, collectionName, aCallback) {
        var myHost = null;
        var myDB = null;
        var username = null;
        var password = null;

        if (environment == 'DEV') {
            myHost = 'ds015780.mlab.com:15780';
            myDB = 'heroku_l6cnt4kv';
            username = 'app_choregg_dev';
            password = 'fHK2NxT5CrGZSFvS';
        } else if (environment == 'QA') {
            myHost = 'ds031978.mlab.com:31978';
            myDB = 'heroku_fbw36qss';
            username = 'app_choregg_qa';
            password = 'BCSkpQ5dDHwZRe4X';
        } else if (environment == 'PROD') {
            myHost = 'ds015939.mlab.com:15939';
            myDB = 'heroku_9nm45jhg';
            username = 'app_choregg';
            password = 'pJkAc2THuFWE6nUb';
        } else {
            res.status(400).send({Error: "Invalid environment for restore: " + environment});
            return;
        }

        var path = './dump/choregg/' + collectionName + '.bson';

        var args = ['-h', myHost, '-d', myDB, '-c', collectionName, '-u', username , '-p', password, path]
            , mongorestore = spawn('/usr/local/bin/mongorestore', args);

        console.log(args.toString());

        mongorestore.stdout.on('data', function (data) {
            return;
        });
        mongorestore.stderr.on('data', function (data) {
            return;
        });
        mongorestore.on('exit', function (code) {
            aCallback();
            return;
        });
    },

    handleErrors: function (res, err) {
        if (err) {
            res.status(400).send(err);
            return;
        }
    },

    handleErrorsAndItems: function (err, items, res) {
        if (err)
            res.status(400).send(err);

        res.json(items);
    },

    deleteFolderRecursive: function(path) {
        deleteFolderRecursive(path);
    }
};