var Category = require('./../models/category');

module.exports = {
    //getCategories - Use this to get the distinct categories in the entire database
    getAll: function (res) {
        Category.find(function (err, categories) {
            if (err) {
                res.status(400).send({Error: err});
            }

            else {
                console.log('got here 3');
                var myCategories = [];

                categories.forEach(function(aCategory) {
                    var found = false;

                    myCategories.forEach(function(myCategory) {
                        if(myCategory.categoryName == aCategory.name) {
                            found = true;
                        }
                    });

                    if(!found) {
                        myCategories.push({categoryName:aCategory.name});
                    }
                });

                res.status(200).send(myCategories);
            }
        });
    }

};