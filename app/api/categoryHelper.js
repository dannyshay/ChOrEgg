var Item = require('./../models/item');
var utilities = require("./server_utilities");

module.exports = {
    //getCategories - Use this to get the distinct categories in the entire database
    getCategories: function (res) {
        Item.find().distinct('category', function (err, items) {
            utilities.handleErrorsAndItems(err, {Categories: items}, res);
        });
    }

};