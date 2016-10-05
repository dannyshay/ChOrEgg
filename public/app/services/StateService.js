angular
    .module('choregg')
    .factory('StateService', ['TimerService', 'UserService', '$rootScope', 'CategoryService', 'DifficultyService', 'ItemService', 'LoadingService', function(TimerService, UserService, $rootScope, CategoryService, DifficultyService, ItemService, LoadingService) {
        var currentState = "splash";

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

                switch (aState) {
                    case 'game':
                        break;
                    case 'chooseCategory':
                        TimerService.stopTimer();
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