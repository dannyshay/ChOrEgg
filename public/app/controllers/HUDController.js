angular
    .module('choregg')
    .controller('HudController', ['$scope', 'HUDService', function($scope, HUDService) {
        // Watch the score
        $scope.$watch(function () { return HUDService.getCurrentScore(); },
            function (aScore) { $scope.currentScore = aScore; }
        );

        // Watch the strikes
        $scope.$watch(function () { return HUDService.getNumStrikes(); },
            function (aNumStrikes) {
                $scope.numStrikes = aNumStrikes;

                // Game over baby!
                if ($scope.numStrikes && $scope.numStrikes >= 5) {
                    alert('GAME OVER!!');
                    HUDService.resetNumStrikes();
                    HUDService.resetCurrentScore()
                }
            }
        );

        // Used by Angular in the view (hud.html)
        $scope.getNumber = function(number) {
            return new Array(number);
        };
    }]);