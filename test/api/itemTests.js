var myApp = require('../../app.js');
var request = require('supertest')(myApp);

describe("Items", function() {
    // Mocha system-level timeout for all tests
    this.timeout(5000);
    var items = [];

    // -------------------------ITEMS------------------------
    it("GET /api/items - should return some items.", function (done) {
        request
            .get('/api/items')
            .expect(200)
            .expect(function (res) {
                if (!(res.body.length > 0)) throw new Error("GET /api/items - No items returned.");
                items = res.body;
            })
            .end(done);
    });

    it("GET /api/items/getItemsInTimespan - should return random items within the proper timespan that don't match the old item set.", function(done) {
        var timespan = 15;
        var category = "People";
        var numPairs = 4;
        var anOldItemSet = items.slice(0,2);

        request
            .get('/api/items/getItemsInTimespan?category=' + category + '&timeSpan=' + timespan + '&numPairs=' + numPairs + '&anOldItemSet=' + JSON.stringify(anOldItemSet))
            .expect(200)
            .expect(function(res) {
                // Confirm we got the correct number of items back
                if(!(res.body.length == numPairs)) throw new Error("GET /api/items/getItemsInTimespan - Incorrect # of items returned. Expected: " + numPairs + ", received: " + res.body.Items.length);

                // Grab the top item set
                var item1 = res.body[0].itemSet[0];
                var item2 = res.body[0].itemSet[1];

                // Check the timespan against the input parameter
                if(!(Math.abs(item1.date - item2.date) <= timespan)) throw new Error("GET /api/items/getItemsInTimespan - Items weren't in timespan specified.");

                // Check the category matches input
                if(item1.category != category) throw new Error("GET /api/items/getItemsInTimespan - Items weren't the specified category.");

                anOldItemSet.forEach(function(anItem) {
                    if (anItem.front == item1.front || anItem.front == item2.front) {
                        throw new Error("GET /api/items/getItemsInTimespan - Items matched oldItems.");
                    }
                });
            }).end(done);
    });
});