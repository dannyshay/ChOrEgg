var request = require('request');
var fs = require('fs');
var gm = require('gm');

module.exports = {
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    download: function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    },

    cropImageToBounds: function (myImgPath, myMinImgPath, width, height) {
        gm(myImgPath)
            .resize(width, height, '^')
            .gravity('Center')
            .crop(width, height)
            .compress('jpeg')
            .write(myMinImgPath, function (err) {
                if (err) console.log(err);
                fs.unlink(myImgPath);
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