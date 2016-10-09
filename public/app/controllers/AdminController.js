angular
    .module('choregg')
    .controller('AdminController', ["$scope", function($scope) {
        $scope.$on('loadingChanged', function(event, options) {
            $scope.loading = options.loading;
        });

        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState =  options.currentState;
        });
    }]);