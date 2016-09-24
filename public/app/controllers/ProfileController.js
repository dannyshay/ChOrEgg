angular
    .module('choregg')
    .controller('ProfileController', ["$scope", "UserService", function($scope) {
        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState = options.currentState;
        });

        $scope.$on('userChanged', function(event, options) {
            $scope.user = options.user;
        });
    }]);