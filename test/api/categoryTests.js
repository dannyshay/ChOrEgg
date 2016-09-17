var myApp = require('../../server.js');
var request = require('supertest')(myApp);

describe("Categories", function() {
    // Mocha system-level timeout for all tests
    this.timeout(5000);

    // -------------------------CATEGORIES------------------------
    it("GET /api/categories - should return some categories.", function(done) {
        request
            .get('/api/items/categories')
            .expect(200)
            .expect(function(res) {
                if(!(res.body.Categories.length > 0)) throw new Error("GET /api/items/categories - No items returned.")
            })
            .end(done);
    });

    it("GET /api/:category/count - should return some a number greater than 0.", function(done) {
        request
            .get('/api/items/People/count')
            .expect(200)
            .expect(function(res) {
                if(!(parseInt(res.body) > 0)) throw new Error("GET /api/items/:category/count - Not greater than 0.")
            })
            .end(done);
    });
});