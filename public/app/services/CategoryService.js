angular
    .module('choregg')
    .factory('CategoryService', ['$cookies','choreggAPI', '$q', function($cookies, choreggAPI, $q) {
        var categories = [];
        var currentCategory = '';

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
                            choreggAPI.Categories.get(function (data) {
                                myCategories = data.Categories;
                                // Save the categories to a cookie
                                $cookies.put('categories', JSON.stringify(myCategories));
                            });
                        } else {
                            // Parse the caetegories from the cookie
                            myCategories = JSON.parse(myCategories);
                        }

                        // Set the values and return the current categories in the Promise
                        categories = myCategories;
                        currentCategory = categories[0];
                        resolve(categories);
                    }
                );
            }
        }
    }]);