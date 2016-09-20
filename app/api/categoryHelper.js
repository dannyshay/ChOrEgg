var Item = require('./../models/item');

module.exports = {
    //getCategories - Use this to get the distinct categories in the entire database
    getCategories: function (res) {
        Item.find().distinct('category', function (err, categories) {
            if (err)
                res.status(400).send({Error: err});
            else {
                var myCategories = [];

                categories.forEach(function(aCategory) {
                   myCategories.push({categoryName:aCategory});
                });

                res.status(200).send(myCategories);
            }
        });
    }

};