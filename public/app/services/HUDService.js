angular
    .module('choregg')
    .factory('HUDService', ['UserService', function(UserService) {
        var currentScore = 0;
        var numStrikes = 0;

        return {
            getCurrentScore: function() {
                return currentScore;
            },
            resetNumStrikes: function() {
                numStrikes = 0;
            },
            resetCurrentScore: function() {
                currentScore = 0;
            },
            getNumStrikes: function() {
                return numStrikes;
            },
            addStrike: function() {
                numStrikes += 1;
                return numStrikes;
            },
            addPoints: function(numPoints) {
                currentScore += numPoints;

                UserService.checkUpdateHighScore(currentScore);

                return currentScore;
            },
            initialize: function() {
                currentScore = 0;
                numStrikes = 0;
            }
        }
    }]);