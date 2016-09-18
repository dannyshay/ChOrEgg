angular
    .module('choregg')
    .controller('SplashController', ["$scope", 'StateService', 'LoadingService', function($scope, StateService, LoadingService) {
        StateService.setCurrentState('splash');

        $scope.$watch(function() {return LoadingService.getLoading();},
            function(aLoading) {
                if(aLoading != null && aLoading != $scope.loading) {
                    $scope.loading = aLoading;
                }
            }
        );

        $scope.$watch(function() {return StateService.getCurrentState();},
            function(aState) {
                if(aState != null && aState != $scope.state) {
                    $scope.state = aState;
                }
            }
        );

        $scope.viewGame = function() {
            StateService.setCurrentState('game');
        };
    }]);

    // Not much here for now - this is not used yet