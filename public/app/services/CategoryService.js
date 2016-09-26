angular
    .module('choregg')
    .factory('CategoryService', ['$cookies','choreggAPI', '$q', '$rootScope', function($cookies, choreggAPI, $q, $rootScope) {
        var categories = [];
        var currentCategory = null;

        return {
            getCurrentCategory: function() {
                return currentCategory;
            },
            setCurrentCategory: function(aCategory) {
                currentCategory =  aCategory;
                $rootScope.$broadcast('currentCategoryChanged', {currentCategory: currentCategory});
            },
            loadCategories: function() {
                return $q(function (resolve) {
                    if (categories.length == 0) {
                        choreggAPI.Categories.query(function(someCategories) {
                            categories = someCategories;
                            currentCategory = categories[0];
                            $rootScope.$broadcast('categoriesLoaded', {categories:categories});
                            resolve(categories);
                        });
                    } else {
                        resolve(categories);
                    }
                });
            }
        }
    }]);