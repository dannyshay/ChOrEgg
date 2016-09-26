angular
    .module('choregg')
    .controller('ChooseCategoryController', ['$scope', 'StateService', 'CategoryService', function($scope, StateService, CategoryService) {
        $scope.$on('categoriesLoaded', function(event, options) {
            $scope.categories = options.categories;
        });

        $scope.viewGame = function(aCategory) {
            CategoryService.setCurrentCategory(aCategory);
            StateService.setCurrentState('game');
        }
    }]);