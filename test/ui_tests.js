var myApp = require('../server.js');
var request = require('supertest')(myApp);

describe("API", function() {
    it("GET /api/items - should return some items.", function(done) {
        request
            .get('/api/items')
            .expect(200)
            .expect(function(res) {
                if (!(res.body.length > 0)) throw new Error("/api/items - No items returned.");
            })
            .end(done);
    });
});