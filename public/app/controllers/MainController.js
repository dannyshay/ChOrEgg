angular
    .module('choregg')
    .controller('MainController', ["$scope", "StateService", function($scope, StateService) {
        $scope.$watch(function() {return StateService.getCurrentState();},
            function(aState) {
                if(aState != null && aState != $scope.currentState) { $scope.currentState = aState}
            }
        )
    }]);

    // Not much here for now - this is not used yet