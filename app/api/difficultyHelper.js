var utilities = require("./server_utilities");
var Difficulty = require('./../models/difficulty');

module.exports = {
    getAll: function(res) {
        Difficulty.find(function (err, difficulties) {
            utilities.handleErrorsAndItems(err, {Difficulties:difficulties}, res);
        });
    }
};