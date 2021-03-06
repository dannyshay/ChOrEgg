angular
    .module('choregg')
    .factory('TimerService', ['$rootScope', '$q', function($rootScope, $q) {
        var timeRemaining = 10;
        var isRunning = null;
        var isPaused = null;

        return {
            getTimeRemaining: function() {
                // THIS IS ONLY USED IN TEST
                return timeRemaining;
            },
            getIsRunning: function() {
                // THIS IS ONLY USED IN TEST
                return isRunning;
            },
            getIsPaused: function() {
                // THIS IS ONLY USED IN TEST
                return isPaused;
            },
            pause: function() {
                $rootScope.$broadcast('timer-stop');
                isPaused = true;
                isRunning = false;
                $rootScope.$broadcast('isPausedChanged', {isPaused: isPaused});
                $rootScope.$broadcast('isRunningChanged', {isRunning: isRunning});
            },
            resume: function() {
                $rootScope.$broadcast('timer-start');
                isRunning = true;
                isPaused = false;
                $rootScope.$broadcast('isPausedChanged', {isPaused: isPaused});
                $rootScope.$broadcast('isRunningChanged', {isRunning: isRunning});
            },
            startTimer: function() {
                isRunning = true;
                isPaused = false;
                $rootScope.$broadcast('timer-start');
                $rootScope.$broadcast('isPausedChanged', {isPaused: isPaused});
                $rootScope.$broadcast('isRunningChanged', {isRunning: isRunning});
            },
            tickDown: function() {
                if (isRunning && !isPaused) {
                    timeRemaining -= 1;
                    $rootScope.$broadcast('timeRemainingChanged', {timeRemaining: timeRemaining});
                }
            },
            stopTimer: function () {
                $rootScope.$broadcast('timer-stop');
                isRunning = false;
                isPaused = false;
                $rootScope.$broadcast('isPausedChanged', {isPaused: isPaused});
                $rootScope.$broadcast('isRunningChanged', {isRunning: isRunning});
            },
            restartTimer: function() {
                $rootScope.$broadcast('timer-stop');
                $rootScope.$broadcast('timer-start');
                $rootScope.$broadcast('timer-set-countdown', 10);
                timeRemaining = 10;
                $rootScope.$broadcast('timeRemainingChanged', {timeRemaining: timeRemaining});

                isRunning = true;
                isPaused = false;
                $rootScope.$broadcast('isPausedChanged', {isPaused: isPaused});
                $rootScope.$broadcast('isRunningChanged', {isRunning: isRunning});
            }
        }
    }]);