angular
    .module('choregg')
    .controller('LoadingController', ['$scope', 'LoadingService', function($scope, LoadingService) {
        // Keep an eye on the shared data source for the Loading Indicator displayed in the view (loader.html)
        $scope.$watch(function () { return LoadingService.getLoading(); },
            function (aLoading) {
                $scope.loading = aLoading;
            }
        );
    }]);