angular
    .module('choregg')
    .factory('StateService', ['TimerService', function(TimerService) {
        var currentState = "mainGame";

        return {
            getCurrentState: function() {
                return currentState;
            },
            setCurrentState: function(aState) {
                if (currentState == aState)
                    return;

                currentState = aState;

                switch (aState) {
                    case 'mainGame':
                        TimerService.restartTimer();
                        break;
                    case 'viewProfile':
                        TimerService.stopTimer();
                        break;

                }
            }
        }
    }]);