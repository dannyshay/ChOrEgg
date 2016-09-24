angular
    .module('choregg')
    .controller('LoadingController', ['$scope', function($scope) {
        $scope.$on('loadingChanged', function(event, options) {
            $scope.loading = options.loading;
        });
    }]);