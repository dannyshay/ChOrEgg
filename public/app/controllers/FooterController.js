angular
    .module('choregg')
    .controller('FooterController', ['$scope', function($scope) {
        // Watch the score
        $scope.year = new Date().getFullYear();
    }]);