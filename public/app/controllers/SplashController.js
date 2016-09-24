angular
    .module('choregg')
    .controller('SplashController', ["$scope", 'StateService', function($scope, StateService) {
        $scope.$on('loadingChanged', function(event, options) {
            $scope.loading = options.loading;
        });

        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState = options.currentState;
        });

        $scope.viewGame = function() {
            StateService.setCurrentState('game');
        };
    }]);