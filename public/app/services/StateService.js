angular
    .module('choregg')
    .factory('StateService', ['TimerService', 'UserService', '$rootScope', 'CategoryService', 'DifficultyService', 'GameService', 'LoadingService', function(TimerService, UserService, $rootScope, CategoryService, DifficultyService, GameService, LoadingService) {
        var currentState = "splash";

        return {
            setCurrentState: function(aState) {
                if (currentState == aState)
                    return;

                currentState = aState;
                $rootScope.$broadcast('currentStateChanged', {currentState: currentState});

                switch (aState) {
                    case 'game':
                        GameService.getItemsInTimespan(CategoryService.getCurrentCategory().categoryName, DifficultyService.getCurrentDifficulty().timeSpan, 1, true).then(function() {
                            TimerService.restartTimer();
                            LoadingService.setLoading(false);
                        });

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