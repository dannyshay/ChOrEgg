var myApp = require('../../server.js');
var request = require('supertest')(myApp);

describe("Categories", function() {
    // Mocha system-level timeout for all tests
    this.timeout(5000);

    // -------------------------CATEGORIES------------------------
    it("GET /api/categories - should return some categories.", function(done) {
        request
            .get('/api/categories')
            .expect(200)
            .expect(function(res) {
                if(!(res.body.length > 0)) throw new Error("GET /api/categories - No categories returned.")
            })
            .end(done);
    });
});