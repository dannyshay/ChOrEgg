angular
    .module('choregg')
    .factory('StateService', ['TimerService', 'UserService', '$rootScope', function(TimerService, UserService, $rootScope) {
        var currentState = "splash";

        return {
            setCurrentState: function(aState) {
                if (currentState == aState)
                    return;

                currentState = aState;
                $rootScope.$broadcast('currentStateChanged', {currentState: currentState});

                switch (aState) {
                    case 'game':
                        TimerService.restartTimer();
                        break;
                    case 'profile':
                        TimerService.stopTimer();
                        break;
                    case 'leaderboard':
                        UserService.refreshUsers();
                        TimerService.stopTimer();
                        break;
                    case 'splash':
                        TimerService.stopTimer();
                        break;
                }
            }
        }
    }]);