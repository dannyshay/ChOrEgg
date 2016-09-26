angular
    .module('choregg')
    .controller('ChooseCategoryController', ['$scope', 'StateService', 'CategoryService', 'LoadingService', function($scope, StateService, CategoryService, LoadingService) {
        $scope.$on('categoriesLoaded', function(event, options) {
            $scope.categories = options.categories;
        });

        $scope.viewGame = function(aCategory) {
            LoadingService.setLoading(true);
            CategoryService.setCurrentCategory(aCategory);
            StateService.setCurrentState('game');
        }
    }]);