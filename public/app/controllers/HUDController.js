angular
    .module('choregg')
    .controller('HudController', ['$scope', 'HUDService', 'StateService', function($scope, HUDService, StateService) {
        $scope.currentScore = 0;
        $scope.numStrikes = 0;

        // Watch the score
        $scope.$on('currentScoreChanged', function(event, options) {
            $scope.currentScore = options.currentScore;
        });

        $scope.$on('numStrikesChanged', function(event, options) {
            $scope.numStrikes = options.numStrikes;

            // Game Over!!
            if ($scope.numStrikes && $scope.numStrikes >= 5) {
                // TODO: Replace this with a nice modal window
                alert('GAME OVER!!');
                HUDService.resetNumStrikes();
                HUDService.resetCurrentScore()
            }
        });

        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState = options.currentState;
        });

        $scope.$on('loadingChanged', function(event, options) {
            $scope.loading = options.loading;
        });

        // Used by Angular in the view (hud.html)
        $scope.getNumber = function(number) {
            return new Array(number);
        };
    }]);