var utilities = require("./server_utilities");
var fs = require('fs');

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var db = require('../../config/db');
Grid.mongo = mongoose.mongo;

module.exports = {
    getDifficulties: function (res) {
        var items = {
            Difficulties: [
                {name: "Easy", timeSpan: 50},
                {name: "Medium", timeSpan: 20},
                {name: "Hard", timeSpan: 10}
            ]
        };

        utilities.handleErrorsAndItems("", items, res);
    },

    getImage: function (req, res) {
        var id1 = req.query.id1;
        var id2 = req.query.id2;

        if (!id1) {
            res.send({Error: "Must specify a file id."});
            return;
        }

        utilities.getImageBase64(id1, id2, res);
    }
}