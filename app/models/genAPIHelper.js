var utilities = require("./server_utilities");

var fs = require('fs');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var db = require('../../config/db');
Grid.mongo = mongoose.mongo;

module.exports = {
    getAll : function (res) {
        var items = [
            {name: "Easy", timeSpan: 50},
            {name: "Medium", timeSpan: 20},
            {name: "Hard", timeSpan: 10}
        ];

        utilities.handleErrorsAndItems("", items, res);
    },

    getImage : function(req, res) {
        var id = req.query.id;

        if (!id) {
            res.send({Error: "Must specify a file id."});
            return;
        }

        var filename = id + '.jpeg'

        var conn = mongoose.createConnection(db.url);
        conn.once('open', function () {
            var gfs = Grid(conn.db, mongoose.mongo);

            var readStream = gfs.createReadStream({filename: filename});

            var bufs = [];

            readStream.on('data', function(chunk) {
                bufs.push(chunk);
            }).on('end', function () {
                var fbuf = Buffer.concat(bufs);

                var base64 = (fbuf.toString('base64'));

                res.send(base64);
            });
        });
    }
}