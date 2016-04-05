var utilities = require("./server_utilities");

module.exports = {
    getAll: function (res) {
        var items = [
            {name: "Easy", timeSpan: 50},
            {name: "Medium", timeSpan: 20},
            {name: "Hard", timeSpan: 10}
        ];

        utilities.handleErrorsAndItems("", items, res);
    }
}