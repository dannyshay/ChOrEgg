angular
    .module('choregg')
    .factory('StateService', ['TimerService', 'UserService', function(TimerService, UserService) {
        var currentState = "game";

        return {
            getCurrentState: function() {
                return currentState;
            },
            setCurrentState: function(aState) {
                if (currentState == aState)
                    return;

                currentState = aState;

                switch (aState) {
                    case 'game':
                        TimerService.restartTimer();
                        break;
                    case 'profile':
                        TimerService.stopTimer();
                        break;
                    case 'leaderboard':
                        UserService.updateUsers();
                        TimerService.stopTimer();
                        break;
                }
            }
        }
    }]);