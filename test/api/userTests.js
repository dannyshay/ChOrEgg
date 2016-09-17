var myApp = require('../../server.js');
var request = require('supertest')(myApp);

describe("Users", function() {
    // Mocha system-level timeout for all tests
    this.timeout(5000);

    // -----------------------FUNCTIONS----------------------
    var handleErrorsAndResponse = function(err, res, done) {
        if (res.body.Error)
            done(new Error(res.body.Error));
        else if (err)
            done(err);
        else
            done();
    };

    // -------------------------USERS------------------------

    // This is our test user who will get added and then removed from the database in order to verify the APIs
    var myTestUser = {
        username: "mochaTestUser",
        createdDate: "01012016",
        lastSignInDate: "06012016",
        highScore: 20
    };

    // Create the test user that we'll delete later
    it("POST /api/users - should create a user.", function(done) {
        request
            .post('/api/users')
            .type('form')
            .send(myTestUser)
            .set('Accept', /application\/json/)
            .expect(201)
            .end(function(err, res) {
                handleErrorsAndResponse(err, res, done);
            });
    });

    // Update the user's highScore and confirm it changed
    it("PUT /api/user/:aUsername - should update a user.", function(done) {
        myTestUser.highScore = 25;

        request
            .put('/api/users')
            .type('form')
            .send(myTestUser)
            .set('Accept', /application\/json/)
            .expect(200)
            .end(function(err, res) {
                handleErrorsAndResponse(err, res, done);
            });
    });

    // Gets the test user and confirms they exist
    it("GET /api/users/:aUsername - should return a user.", function(done) {
        var aUsername = myTestUser.username;

        request
            .get('/api/users/' + aUsername)
            .expect(200)
            .expect(function(res) {
                if (res.body.code != 0) { throw new Error(res.body.message); }
                if(res.body.user.username != myTestUser.username || res.body.user.createdDate != myTestUser.createdDate || res.body.user.lastSignInDate != myTestUser.lastSignInDate || res.body.user.highScore != myTestUser.highScore) {
                    throw new Error("GET /api/users/:aUsername - invalid user returned: " + JSON.stringify(res.body));
                }
                //  if(!(res.body.username.length > 0) || res.body.username != aUsername) throw new Error("GET /api/user/aUsername - No users returned.");
            })
            .end(function(err, res) {
                handleErrorsAndResponse(err, res, done);
            });
    });

    // Get the list of users in the database (at least we'll have our test user)
    it("GET /api/users - should return some users.", function(done) {
        request
            .get('/api/users')
            .expect(200)
            .expect(function(res) {
                if(!(res.body.users.length > 0)) throw new Error("GET /api/users - No users returned.");
            })
            .end(done);
    });

    // Delete the test user
    it("DELETE /api/users/:aUsername - should delete a user.", function(done) {
        request
            .delete('/api/users/'+ myTestUser.username)
            .expect(200)
            .end(function(err, res) {
                handleErrorsAndResponse(err, res, done);
            });
    });
});