angular
    .module('choregg')
    .factory('HUDService', ['UserService', '$rootScope', 'ModeService', function(UserService, $rootScope, ModeService) {
        var currentScore = 0;
        var numStrikes = 0;

        return {
            getCurrentScore: function() {
                // THIS IS ONLY USED IN TEST
                return currentScore;
            },
            getNumStrikes: function() {
                // THIS IS ONLY USED IN TEST
                return numStrikes;
            },
            resetNumStrikes: function() {
                numStrikes = 0;
                $rootScope.$broadcast('numStrikesChanged', {numStrikes: numStrikes});
            },
            resetCurrentScore: function() {
                currentScore = 0;
                $rootScope.$broadcast('currentScoreChanged', {currentScore: currentScore});
            },
            addStrike: function() {
                if (ModeService.getMode() != "Endless") {
                    numStrikes += 1;
                    $rootScope.$broadcast('numStrikesChanged', {numStrikes: numStrikes});
                }

                return numStrikes;
            },
            addPoints: function(numPoints) {
                currentScore += numPoints;
                $rootScope.$broadcast('currentScoreChanged', {currentScore: currentScore});

                UserService.checkUpdateHighScore(currentScore);

                return currentScore;
            },
            initialize: function() {
                currentScore = 0;
                numStrikes = 0;
                $rootScope.$broadcast('currentScoreChanged', {currentScore: currentScore});
                $rootScope.$broadcast('numStrikesChanged', {numStrikes: numStrikes});
            }
        }
    }]);