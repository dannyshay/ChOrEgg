angular
    .module('choregg')
    .controller('MainController', ["$scope", function($scope) {
        $scope.currentState = "splash";

        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState =  options.currentState;
        });
    }]);