angular
    .module('choregg')
    .controller('LeaderboardController', ["$scope", function($scope) {
        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState = options.currentState;
        });

        $scope.$on('usersChanged', function(event, options) {
            $scope.users = options.users;

            $scope.users.forEach(function(aUser) {
                // Remove the email domains for privacy
                aUser.username = aUser.username.split('@')[0];
            });
        });
    }]);