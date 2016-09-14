angular
    .module('choregg')
    .factory('HUDService', [function() {
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
                return currentScore;
            },
            initialize: function() {
                currentScore = 0;
                numStrikes = 0;
            }
        }
    }]);