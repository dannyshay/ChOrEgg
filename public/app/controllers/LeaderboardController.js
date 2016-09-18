angular
    .module('choregg')
    .controller('LeaderboardController', ["$scope", "UserService", function($scope, UserService) {

        $scope.$watch(function() {return UserService.getUsers();},
            function(aSetOfUsers) {
                if(aSetOfUsers != null && aSetOfUsers != $scope.users) {
                    $scope.users = aSetOfUsers;

                    $scope.users.forEach(function(aUser) {
                        // Remove the email domains for privacy
                        aUser.username = aUser.username.split('@')[0];
                    });
                }
            }
        )
    }]);