var myApp = require('../../server.js');
var request = require('supertest')(myApp);

describe("Items", function() {
    // Mocha system-level timeout for all tests
    this.timeout(5000);

    // -------------------------ITEMS------------------------
    it("GET /api/items - should return some items.", function (done) {
        request
            .get('/api/items')
            .expect(200)
            .expect(function (res) {
                if (!(res.body.length > 0)) throw new Error("GET /api/items - No items returned.");
            })
            .end(done);
    });

    it("GET /api/items/getItemsInTimespan - should return random items within the proper timespan.", function(done) {
        var timespan = 15;
        var category = "People";
        var numPairs = 4;

        request
            .get('/api/items/getItemsInTimespan?category=' + category + '&timeSpan=' + timespan + '&numPairs=' + numPairs)
            .expect(200)
            .expect(function(res) {
                if(!(res.body.length == numPairs)) throw new Error("GET /api/items/getItemsInTimespan - Incorrect # of items returned. Expected: " + numPairs + ", received: " + res.body.Items.length);
                var item1 = res.body[0].itemSet[0];
                var item2 = res.body[0].itemSet[1];

                if(!(Math.abs(item1.date - item2.date) <= timespan)) throw new Error("GET /api/items/getItemsInTimespan - Items weren't in timespan specified.");
            }).end(done);
    });
});