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
                $rootScope.$broadcast('numStrikesUpdated');
            },
            resetCurrentScore: function() {
                currentScore = 0;
                $rootScope.$broadcast('currentScoreUpdated');
            },
            getNumStrikes: function() {
                return numStrikes;
            },
            addStrike: function() {
                numStrikes += 1;
                $rootScope.$broadcast('numStrikesUpdated');
                return numStrikes;
            },
            addPoints: function(numPoints) {
                currentScore += numPoints;
                $rootScope.$broadcast('currentScoreUpdated');

                UserService.checkUpdateHighScore(currentScore);

                return currentScore;
            },
            initialize: function() {
                currentScore = 0;
                numStrikes = 0;
                $rootScope.$broadcast('currentScoreUpdated');
                $rootScope.$broadcast('numStrikesUpdated');
            }
        }
    }]);