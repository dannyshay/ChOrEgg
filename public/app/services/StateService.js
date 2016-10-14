angular
    .module('choregg')
    .factory('StateService', ['TimerService', 'UserService', '$rootScope', function(TimerService, UserService, $rootScope) {
        var currentState = null;

        return {
            getCurrentState: function() {
                //THIS IS ONLY USED IN TEST
                return currentState;
            },
            setCurrentState: function(aState) {
                if (currentState == aState)
                    return;

                currentState = aState;
                $rootScope.$broadcast('currentStateChanged', {currentState: currentState});

                if (aState === 'game') {
                } else if (aState === 'leaderboard') {
                    UserService.refreshUsers();
                    TimerService.stopTimer();
                    TimerService.stopTimer();
                } else if (aState == 'chooseCategory' || aState == 'chooseMode' || aState == 'profile' || aState == 'splash' || aState == 'admin') {
                    TimerService.stopTimer();
                }
            }
        }
    }]);