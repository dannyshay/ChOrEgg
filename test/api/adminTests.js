var myApp = require('../../app.js');
var request = require('supertest')(myApp);

describe("Admin Functions", function() {
    // Mocha system-level timeout for all tests
    this.timeout(5000);

    // -------------------------ADMIN FUNCTIONS---------------------
    it("GET /api/getVariable/:aVariable - should return a result.", function(done) {
		var myVariable = "mode";

        request
            .get('/api/getVariable/' + myVariable)
            .expect(200)
            .expect(function(res) {
                if(!(res.body.value)) throw new Error("GET /api/getVariable - No result returned.")
            })
            .end(done);
    });
});