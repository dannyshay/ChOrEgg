angular
    .module('choregg')
    .controller('SplashController', ["$scope", 'StateService', 'CategoryService', 'DifficultyService', function($scope, StateService, CategoryService, DifficultyService) {
        CategoryService.loadCategories();
        DifficultyService.loadDifficulties();

        $scope.$on('loadingChanged', function(event, options) {
            $scope.loading = options.loading;
        });

        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState = options.currentState;
        });

        $scope.viewChooseCategory = function() {
            StateService.setCurrentState('chooseCategory');
        };
    }]);