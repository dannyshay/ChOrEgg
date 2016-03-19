// grab the Item model we created
var Item = require('./models/item');

module.exports = function(app) {
    // server routes ==============================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/items', function(req, res) {
       // use mongoose to get all items in the database
        Item.find(function(err, items) {
           // if there is an error retrieving, send the error.
           // nothing after res.sender(err) will execute

            if (err)
                res.send(err);

            res.json(items); //return all items in JSON format
        });
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes ============================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
       res.sendFile('./public/views/index.html'); //load our public/index.html file
    });
};