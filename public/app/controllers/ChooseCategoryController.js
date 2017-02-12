angular
    .module('choregg')
    .controller('ChooseCategoryController', ['$scope', 'StateService', 'CategoryService', 'LoadingService', function($scope, StateService, CategoryService, LoadingService) {
        $scope.$on('categoriesLoaded', function(event, options) {
            $scope.categories = options.categories;
            $scope.selectedCategory = JSON.stringify($scope.categories[0]);
        });

        $scope.$on('loadingChanged', function(event, options) {
            if (options.loading != null && options.loading != $scope.loading) {
                $scope.loading = options.loading;
            }
        });

        $scope.viewGame = function() {
            LoadingService.setLoading(true);
            CategoryService.setCurrentCategory(JSON.parse($scope.selectedCategory));
            StateService.setCurrentState('game');
        };
    }]);