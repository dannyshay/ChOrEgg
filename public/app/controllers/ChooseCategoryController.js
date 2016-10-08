angular
    .module('choregg')
    .controller('ChooseCategoryController', ['$scope', 'StateService', 'CategoryService', 'LoadingService', function($scope, StateService, CategoryService, LoadingService) {
        $scope.$on('categoriesLoaded', function(event, options) {
            $scope.categories = options.categories;
        });

        $scope.$on('loadingChanged', function(event, options) {
            if (options.loading != null && options.loading != $scope.loading) {
                $scope.loading = options.loading;
            }
        });

        $scope.viewGame = function(aCategory) {
            LoadingService.setLoading(true);
            CategoryService.setCurrentCategory(aCategory);
            StateService.setCurrentState('game');
        };
    }]);