var utilities = require("./server_utilities");
var User = require('./../models/user');



module.exports = {
    getAll: function (res) {
        User.find(function (err, users) {
            utilities.handleErrorsAndItems(err, users, res);
        });
    }
}