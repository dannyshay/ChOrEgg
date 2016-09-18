angular
    .module('choregg')
    .controller('TimerController', ['$scope', 'TimerService', 'ItemService', 'HUDService', 'DifficultyService', 'CategoryService', 'LoadingService', function($scope, TimerService, ItemService, HUDService, DifficultyService, CategoryService, LoadingService) {
        //NOTE - the timer that is first stared is stared automatically by the <timer> directive in timer.htm
        $scope.$watch(function() { return LoadingService.getLoading();},
            function(aLoading) {
                if(aLoading != null && aLoading != $scope.isLoading) {
                    $scope.isLoading = aLoading;
                }
            }
        );

        $scope.$watch(function() { return TimerService.getIsRunning();},
            function(aIsRunning) {
                if(aIsRunning != null && aIsRunning != $scope.isRunning) {
                    $scope.isRunning = aIsRunning;
                }
            }
        );

        $scope.$watch(function() { return TimerService.getIsPaused();},
            function(aIsPaused) {
                if(aIsPaused != null && aIsPaused != $scope.isPaused) {
                    $scope.isPaused = aIsPaused;
                }
            }
        );

        // Get the time remaining in the shared data service (we want to keep this in sync with our scope variable)
        $scope.$watch(function() { return TimerService.getTimeRemaining();},
            function(aTimeRemaining) {
                // Update the local scope variable so we show the right amount in the progress bar
                $scope.timeRemaining = aTimeRemaining;

                // Check for a timeout scenario
                if ($scope.timeRemaining == 0) {
                    TimerService.restartTimer();
                    ItemService.shiftItems();
                    HUDService.addStrike();

                    // Get some more items (up to 10 based on currenct amount in item cache) to keep going
                    ItemService.getItemsInTimespan(CategoryService.getCurrentCategory(), DifficultyService.getCurrentDifficulty().timeSpan, 10 - ItemService.getItems().length);
                }

                // Update the timer if necessary (this is ugly but must be done :( )
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        );

        // Every time the ticker ticks (once per second)
        $scope.$on('timer-tick', function(event, value) {
            // Subtract a second from our 'time remaining'
            TimerService.tickDown();
            //Re-draw the timer if necessary
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        });

    }]);