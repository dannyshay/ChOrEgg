var Item = require('./../models/item');
var utilities = require("./server_utilities");

module.exports = {
    //getCategories - Use this to get the distinct categories in the entire database
    getDifficulties: function (res) {
        var items = {
            Difficulties: [
                {name: "Easy", timeSpan: 50},
                {name: "Medium", timeSpan: 20},
                {name: "Hard", timeSpan: 10}
            ]
        };

        utilities.handleErrorsAndItems("", items, res);
    }
}