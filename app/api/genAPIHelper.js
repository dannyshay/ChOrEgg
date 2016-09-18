var utilities = require("./server_utilities");
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

module.exports = {
    getImage: function (req, res) {
        var id1 = req.query.id1;
        var id2 = req.query.id2;

        if (!id1) {
            res.status(400).send({Error: "Must specify a file id."});
            return;
        }

        utilities.getImageBase64(id1, id2, res);
    }
};