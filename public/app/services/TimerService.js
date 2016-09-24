angular
    .module('choregg')
    .factory('TimerService', ['$rootScope', '$q', function($rootScope, $q) {
        var timeRemaining = 10;
        var isRunning = null;
        var isPaused = null;

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
            getIsPaused: function() {
                return isPaused;
            },
            pause: function() {
                $rootScope.$broadcast('timer-stop');
                isPaused = true;
                isRunning = false;
                $rootScope.$broadcast('pausedChanged');
                $rootScope.$broadcast('runningChanged');
            },
            resume: function() {
                $rootScope.$broadcast('timer-start');
                isRunning = true;
                isPaused = false;
                $rootScope.$broadcast('pausedChanged');
                $rootScope.$broadcast('runningChanged');
            },
            startTimer: function() {
                isRunning = true;
                isPaused = false;
                $rootScope.$broadcast('timer-start');
                $rootScope.$broadcast('pausedChanged');
                $rootScope.$broadcast('runningChanged');
            },
            tickDown: function() {
                timeRemaining -= 1;
            },
            stopTimer: function () {
                $rootScope.$broadcast('timer-stop');
                isRunning = false;
                isPaused = false;
                $rootScope.$broadcast('pausedChanged');
                $rootScope.$broadcast('runningChanged');
            },
            restartTimer: function() {
                return $q(function(resolve) {
                    $rootScope.$broadcast('timer-set-countdown', 10);
                    if (!isRunning) {
                        $rootScope.$broadcast('timer-start');
                        isRunning = true;
                        isPaused = false;
                    }

                    timeRemaining = 10;
                    $rootScope.$broadcast('pausedChanged');
                    $rootScope.$broadcast('runningChanged');
                    resolve();
                });

            }
        }
    }]);