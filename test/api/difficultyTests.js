var myApp = require('../../server.js');
var request = require('supertest')(myApp);

describe("Difficulties", function() {
    // Mocha system-level timeout for all tests
    this.timeout(5000);

    // -------------------------DIFFICULTIES------------------------
    it("GET /api/difficulties - should return some difficulties.", function(done) {
        request
            .get('/api/difficulties')
            .expect(200)
            .expect(function(res) {
                if(!(res.body.length > 0)) throw new Error("GET /api/difficulties - No difficulties returned.")
            })
            .end(done);
    });
});