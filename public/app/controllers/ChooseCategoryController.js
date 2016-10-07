angular
    .module('choregg')
    .controller('ChooseCategoryController', ['$scope', 'StateService', 'ModeService', function($scope, StateService, ModeService) {
        $scope.$on('categoriesLoaded', function(event, options) {
            $scope.categories = options.categories;
        });

        $scope.$on('loadingChanged', function(event, options) {
            if (options.loading != null && options.loading != $scope.loading) {
                $scope.loading = options.loading;
            }
        });

        $scope.viewChooseMode = function(aMode) {
            ModeService.setMode(aMode);
            StateService.setCurrentState('chooseMode');
        }
    }]);