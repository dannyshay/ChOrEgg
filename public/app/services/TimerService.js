angular
    .module('choregg')
    .factory('TimerService', ['$rootScope', '$q', function($rootScope, $q) {
        var timeRemaining = 10;

        return {
            getTimeRemaining: function() {
                return timeRemaining;
            },
            initialize: function() {
              timeRemaining = 10;
            },
            startTimer: function() {
                $rootScope.$broadcast('timer-start');
            },
            tickDown: function() {
                timeRemaining -= 1;
            },
            stopTimer: function () {
                $rootScope.$broadcast('timer-stop');
            },
            restartTimer: function() {
                $rootScope.$broadcast('timer-set-countdown', 10);
                timeRemaining = 10;
            }
        }
    }]);