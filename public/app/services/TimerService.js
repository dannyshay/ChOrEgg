angular
    .module('choregg')
    .factory('TimerService', ['$rootScope', '$q', function($rootScope, $q) {
        var timeRemaining = 10;
        var isRunning = false;

        return {
            getTimeRemaining: function() {
                return timeRemaining;
            },
            initialize: function() {
              timeRemaining = 10;
            },
            getIsRunning: function() {
              return isRunning;
            },
            startTimer: function() {
                $rootScope.$broadcast('timer-start');
                isRunning = true;
            },
            tickDown: function() {
                timeRemaining -= 1;
            },
            stopTimer: function () {
                $rootScope.$broadcast('timer-stop');
                isRunning = false;
            },
            restartTimer: function() {
                return $q(function(resolve) {
                    $rootScope.$broadcast('timer-set-countdown', 10);
                    timeRemaining = 10;
                    resolve();
                });

            }
        }
    }]);