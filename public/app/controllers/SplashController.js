angular
    .module('choregg')
    .controller('SplashController', ["$scope", 'StateService', 'CategoryService', 'DifficultyService', 'ModeService', function($scope, StateService, CategoryService, DifficultyService, ModeService) {
        StateService.setCurrentState("splash");
        CategoryService.loadCategories();
        DifficultyService.loadDifficulties();

        $scope.$on('loadingChanged', function(event, options) {
            $scope.loading = options.loading;
        });

        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState = options.currentState;
        });

        $scope.viewChooseMode = function() {
            StateService.setCurrentState('chooseMode');
        };
    }]);