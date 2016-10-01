angular
    .module('choregg')
    .factory('CategoryService', ['$cookies','choreggAPI', '$q', '$rootScope', 'LoadingService', function($cookies, choreggAPI, $q, $rootScope, LoadingService) {
        var categories = [];
        var currentCategory = null;

        return {
            getCurrentCategory: function() {
                return currentCategory;
            },
            setCurrentCategory: function(aCategory) {
                LoadingService.setLoading(true);
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