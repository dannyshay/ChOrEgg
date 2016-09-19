var request = require('request');
var fs = require('fs');
var gm = require('gm');

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var db = require('../../config/db');
Grid.mongo = mongoose.mongo;

module.exports = {
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    download: function (uri, filename, callback) {
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

    handleErrors: function (res, err) {
        if (err)
            res.status(400).send(err);
    },

    handleErrorsAndItems: function (err, items, res) {
        if (err)
            res.status(400).send(err);

        res.json(items);
    }
};