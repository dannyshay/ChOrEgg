var myApp = require('../server.js');
var request = require('supertest')(myApp);

describe("API", function() {
    it("GET /api/items - should return some items.", function (done) {
        request
            .get('/api/items')
            .expect(200)
            .expect(function (res) {
                if (!(res.body.length > 0)) throw new Error("GET /api/items - No items returned.");
            })
            .end(done);
    });

    it("GET /api/categories - should return some categories.", function(done) {
        request
            .get('/api/items/categories')
            .expect(200)
            .expect(function(res) {
                if(!(res.body.length > 0)) throw new Error("GET /api/items/categories - No items returned.")
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

    it("GET /api/items/images - should return some image URLs.", function(done) {
        request
            .get('/api/items/images')
            .expect(200)
            .expect(function(res) {
                if(!res.body.length > 0) throw new Error("GET /api/items/images - No urls returned.")
            })
            .end(done);
    });

    it("GET /api/items/:category - should return some items.", function(done) {
       request
           .get('/api/items/People/')
           .expect(200)
           .expect(function(res) {
               if(!res.body.length > 0) throw new Error("GET /api/items/:category - No items returned.")
           })
           .end(done);
    });
});