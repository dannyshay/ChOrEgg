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

    cropImageToBounds: function (myImgPath, myMinImgPath, width, height, imgName) {
        var myFunction = function (anImgName, aMinImgPath, aGfs) {
            var writestream = aGfs.createWriteStream({
                filename: anImgName
            });
            var stream = fs.createReadStream(aMinImgPath)
            stream.pipe(writestream);
            stream.on('close', function () {
                fs.unlink(aMinImgPath);
            });
        }

        gm(myImgPath)
            .resize(width, height, '^')
            .gravity('Center')
            .crop(width, height)
            .compress('jpeg')
            .write(myMinImgPath, function (err) {
                if (err) console.log(err);
                fs.unlink(myImgPath);

                var conn = mongoose.createConnection(db.url);
                conn.once('open', function () {
                    var gfs = Grid(conn.db, mongoose.mongo);

                    gfs.exist({filename: imgName}, function (err, found) {
                        if (found) {
                            gfs.remove({filename: imgName}, function (err) {
                                if (err) return err;

                                myFunction(imgName, myMinImgPath, gfs);
                            })
                        } else {
                            myFunction(imgName, myMinImgPath, gfs);
                        }

                    });
                });
            });
    },
    createDirectoryIfDoesntExist: function (directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
    },

    getImageBase64: function (id1, id2, res) {
        var filename = id1 + '.jpeg'
        var filename2 = (id2 ? id2 + '.jpeg' : "");

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

                        res.send([base64, base642]);
                    })
                } else {
                    res.send(base64)
                }
            });
        });
    },

    handleErrors: function (res, err) {
        if (err)
            res.send(err);
    },

    handleErrorsAndItems: function (err, items, res) {
        if (err)
            res.send(err);

        res.json(items);
    }
};