angular
    .module('choregg')
    .controller('ProfileController', ["$scope", "UserService", function($scope, UserService) {
        $scope.$watch(function() {return UserService.getCurrentUser();},
            function(aUser) {
                if(aUser != null && aUser != $scope.user) {
                    $scope.user = aUser;
                }
            }
        )
    }]);

    // Not much here for now - this is not used yet