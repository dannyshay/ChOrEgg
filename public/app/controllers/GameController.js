angular
    .module('choregg')
    .controller('GameController', ['$scope', '$http', '$cookies', '$analytics', '$timeout',  '$q', 'TimerService', 'CategoryService', 'DifficultyService', 'GameService','HUDService', 'LoadingService', 'UserService', 'StateService', function ($scope, $http, $cookies, $analytics, $timeout,  $q, TimerService, CategoryService, DifficultyService, GameService, HUDService, LoadingService, UserService, StateService) {
        //-------------------------------------- EXECUTED SCRIPT --------------------------------------
        // - This is the script that is executed when the page first loads
        // - We load the categories / difficulties and then set the local variables
        // - Lastly, we get some items using the defaults we just got back from the server
        //---------------------------------------------------------------------------------------------
        LoadingService.setLoading(true);
        $scope.loading = true;
        DifficultyService.loadDifficulties().then(function() {
            CategoryService.loadCategories().then(function(){
                // This is needed because we try and load the items immediately - so we can't wait on the $watch() for categories / difficulties
                $scope.difficulties = DifficultyService.getDifficulties();
                $scope.categories = CategoryService.getCategories();

                // Set the default current difficulty and category to the first returned in our lists
                $scope.currentDifficulty = DifficultyService.getCurrentDifficulty();
                $scope.currentCategory = CategoryService.getCurrentCategory();

                getInitialItems();
            });
        });

        //----------------------------------------- BROADCAST HANDLERS ----------------------------------------
        // - Each of these handlers will keep an eye out for an event from the rootController to go back
        //   and look for an updated variable to update the local scope
        // - Each time 'broadcasted' data is updated on a remote controller - these functions will get called
        //-----------------------------------------------------------------------------------------------------
        $scope.$on('pausedChanged', function() {
            var updatedVar = TimerService.getIsPaused();

            if(updatedVar != null && updatedVar != $scope.isPaused) {
                $scope.isPaused = updatedVar;
            }
        });

        $scope.$on('loadingChanged', function() {
            var updatedVar = LoadingService.getLoading();

            if (updatedVar != null && updatedVar != $scope.loading) {
                $scope.loading = updatedVar;
            }
        });

        $scope.$on('currentCategoryChanged', function() {
            var updatedVar = CategoryService.getCurrentCategory();

            if (updatedVar != null && updatedVar != $scope.currentCategory) {
                $scope.currentCategory = updatedVar;

                getInitialItems();
            }
        });

        $scope.$on('currentDifficultyChanged', function() {
            var updatedVar = DifficultyService.getCurrentDifficulty();

            if (updatedVar != null && updatedVar != $scope.currentDifficulty) {
                $scope.currentDifficulty = updatedVar;

                getInitialItems();
            }
        });

        $scope.$on('currentStateChanged', function() {
            var updatedVar = StateService.getCurrentState();

            if (updatedVar != null && updatedVar != $scope.currentState) {
                $scope.currentState = updatedVar;
            }
        });

        //-------------------------------------- CLASS METHODS --------------------------------------
        // - These are the main methods used by this controller
        //---------------------------------------------------------------------------------------------

        // Gets an initial set of items
        // - This method should only be used when initially loading the application - or when switching categories / difficulties
        // - The main idea of this method is tha we load a few sets of items very quickly so the user can play with no loag
        // - If you are wishing to just get more items with the existing category / difficulty - use 'getMoreItems()' below
        function getInitialItems() {
            return $q(function(resolve) {
                GameService.getItemsInTimespan($scope.currentCategory.categoryName, $scope.currentDifficulty.timeSpan, 1, true).then(function() {
                    // Update the local scoped variables with the updated variables in the service (vs doing a $watch)
                    $scope.Items = GameService.getItems();
                    $scope.CurrentItems = GameService.getCurrentItems();

                    //Update the LoadingService and local scoped variable
                    LoadingService.setLoading(false);
                    $scope.loading = false;

                    // Now that we got our first set back and the user can play - go ahead and grab two more real quick :)
                    GameService.getItemsInTimespan($scope.currentCategory.categoryName, $scope.currentDifficulty.timeSpan, 2, false).then(function() {
                        $scope.Items = GameService.getItems();
                        resolve();
                    });
                });
            });
        }
        // Gets more items with the current category / difficulty
        // - This method will use amount of items currently in the item cache ($scope.Items) to determine how many (if any) new items to pull from the API
        function getMoreItems() {
            return $q(function(resolve) {
                var numPairs = 0;

                // If we are null (how??) or we don't have any more items - initialize the array and set the loading flag
                if (!$scope.Items || $scope.Items.length == 0) {
                    LoadingService.setLoading(true);
                    $scope.Items = [];
                }

                // This logic is customized to cache items according to the rate the user can flip the cards
                if ($scope.Items.length <= 1) {
                    numPairs = 2;
                } else if ($scope.Items.length <= 2) {
                    numPairs = 3;
                } else if ($scope.Items.length <= 5) {
                    numPairs = 5;
                } else if ($scope.Items.length <= 10) {
                    numPairs = 10;
                }

                UserService.addRoundPlayed();

                GameService.getItemsInTimespan($scope.currentCategory.categoryName, $scope.currentDifficulty.timeSpan, numPairs, false).then(function() {
                    LoadingService.setLoading(false);
                    resolve();
                });
            });
        }
        //-------------------------------------- SCOPE METHODS --------------------------------------
        // - These are methods used by Angular in the view (item.html)
        //-------------------------------------------------------------------------------------------

        // This event is called when the user clicks one of the cards (and we're not already in the process of an evaluation)
        $scope.imgClick = function ($index) {
            if (!$scope.imageFlipping && !$scope.isPaused) {
                // This flag makes it so the user can't click over and over and over again on the iamges to mess with the timer
                $scope.imageFlipping = true;

                TimerService.stopTimer();

                // Grab the two items from the scope and set their 'correct' property to update the view (item.html) for the CSS color
                $scope.CurrentItems.itemSet[0].correct = ($scope.CurrentItems.itemSet[0].date < $scope.CurrentItems.itemSet[1].date);
                $scope.CurrentItems.itemSet[1].correct = ($scope.CurrentItems.itemSet[0].date >= $scope.CurrentItems.itemSet[1].date);

                // Get the clicked item from the scope so we can work with it easier - and flip it
                var clickedItem;
                clickedItem = $scope.CurrentItems.itemSet[$index];
                clickedItem.flipped = true;

                // Add a point / strike based on how the user did
                if (clickedItem.correct) {
                    $analytics.eventTrack('User choice - Correct');
                    HUDService.addPoints(1);
                } else {
                    $analytics.eventTrack('User choice - Wrong');
                    HUDService.addStrike();
                }
            }
        };

        // This event is called when card flipped from 'front' to 'back'
        $scope.afterFlip = function () {
            $timeout(function () {
                // Flip both of the items back
                $scope.CurrentItems.itemSet.forEach(function (element) {
                    element.flipped = false;
                });

                TimerService.restartTimer();
            }, 500);
        };

        // This event is called when card flipped from 'back' to 'front'
        $scope.afterFlop = function () {
            // Bump the current items off the array using 'shiftItems'
            GameService.shiftItems().then(function() {
                $scope.Items = GameService.getItems();
                $scope.CurrentItems = GameService.getCurrentItems();
                $scope.imageFlipping = false;
                TimerService.startTimer();
                // Then get some more items using the current settings
                getMoreItems()
            });
        };


    }])
    // This directive allows you to specify the 'flip' and 'flop' behavior in the view (item.html)
    .directive('myFlip', function ($animate) {
        return {
            scope: {
                'myFlip': '=',
                'afterFlip': '&',
                'afterFlop': '&'
            },
            link: function (scope, element) {
                scope.$watch("myFlip", function (flip, OldFlipped) {
                    if (flip) {
                        $animate.addClass(element, "flipped").then(scope.afterFlip);
                    }
                    if (!flip && OldFlipped) {
                        $animate.removeClass(element, "flipped").then(scope.afterFlop);
                    }
                });
            }
        }
    });