angular
    .module('choregg')
    .factory('CategoryService', ['$cookies','choreggAPI', '$q', function($cookies, choreggAPI, $q) {
        var categories = [];
        var currentCategory = null;

        return {
            getCategories: function() {
                return categories;
            },
            initialize: function() {
              categories = [];
            },
            getCurrentCategory: function() {
              return currentCategory;
            },
            setCurrentCategory: function(aCategory) {
              currentCategory =  aCategory;
            },
            loadCategories: function() {
                return $q(function (resolve) {
                        // Try and load the categories from cookies first (faster)
                        var myCategories = $cookies.get('categories');
                        if (!myCategories || myCategories == undefined) {
                            // If we don't find anything there - call the API
                            choreggAPI.Categories.query(function (data) {
                                myCategories = data;
                                // Save the categories to a cookie
                                $cookies.put('categories', JSON.stringify(myCategories));

                                categories = myCategories;
                                currentCategory = categories[0];
                                resolve(categories);
                            });
                        } else {
                            // Parse the caetegories from the cookie
                            myCategories = JSON.parse(myCategories);

                            categories = myCategories;
                            currentCategory = categories[0];
                            resolve(categories);
                        }

                    }
                );
            }
        }
    }]);