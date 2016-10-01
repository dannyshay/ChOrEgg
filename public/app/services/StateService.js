angular
    .module('choregg')
    .factory('StateService', ['TimerService', 'UserService', '$rootScope', 'CategoryService', 'DifficultyService', 'ItemService', 'LoadingService', function(TimerService, UserService, $rootScope, CategoryService, DifficultyService, ItemService, LoadingService) {
        var currentState = "splash";

        return {
            setCurrentState: function(aState) {
                if (currentState == aState)
                    return;

                currentState = aState;
                $rootScope.$broadcast('currentStateChanged', {currentState: currentState});

                switch (aState) {
                    case 'game':
                        // var currentCategory = CategoryService.getCurrentCategory();
                        // var currentDifficulty = DifficultyService.getCurrentDifficulty();
                        // console.log('getting first items');
                        // ItemService.getItemsInTimespan(currentCategory.categoryName, currentDifficulty.timeSpan, 1, true).then(function() {
                        //     ItemService.getItemsInTimespan(currentCategory.categoryName, currentDifficulty.timeSpan, 2, false);
                        //     TimerService.restartTimer();
                        //     LoadingService.setLoading(false);
                        // });

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