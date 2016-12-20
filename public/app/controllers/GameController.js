angular
    .module('choregg')
    .controller('GameController', ['$scope', '$http', '$cookies', '$analytics', '$timeout',  '$q', 'TimerService', 'CategoryService', 'DifficultyService', 'ItemService','HUDService', 'LoadingService', 'UserService', function ($scope, $http, $cookies, $analytics, $timeout,  $q, TimerService, CategoryService, DifficultyService, ItemService, HUDService, LoadingService, UserService) {
        //----------------------------------------- BROADCAST HANDLERS ----------------------------------------
        // - Each of these handlers will keep an eye out for an event from the rootController to go back
        //   and look for an updated variable to update the local scope
        // - Each time 'broadcasted' data is updated on a remote controller - these functions will get called
        //-----------------------------------------------------------------------------------------------------
        $scope.$on('itemsChanged', function(event, options) {
            if (options.items[0].itemSet[0].category != CategoryService.getCurrentCategory().categoryName) {
                getInitialItems();
                return;
            }

            $scope.Items = options.items;
        });

        $scope.$on('currentItemsChanged', function(event, options) {
            if (options.currentItems.itemSet[0].category != CategoryService.getCurrentCategory().categoryName) {
                getInitialItems();
                return;
            }

            $scope.CurrentItems = options.currentItems;
        });

        $scope.$on('isPausedChanged', function(event, options) {
            if(options.isPaused != null && options.isPaused != $scope.isPaused) {
                $scope.isPaused = options.isPaused;
            }
        });

        $scope.$on('loadingChanged', function(event, options) {
            if (options.loading != null && options.loading != $scope.loading) {
                $scope.loading = options.loading;
            }
        });

        $scope.$on('modeChanged', function(event, options) {
            if (options.mode != null && options.mode != $scope.mode) {
                $scope.mode = options.mode;
            }
        });

        $scope.$on('currentCategoryChanged', function(event, options) {
            if (options.currentCategory != null && options.currentCategory != $scope.currentCategory) {
                $scope.currentCategory = options.currentCategory;

                if ($scope.currentState == 'game') { getInitialItems();}
            }
        });

        $scope.$on('currentDifficultyChanged', function(event, options) {
            if (options.currentDifficulty != null && options.currentDifficulty != $scope.currentDifficulty) {
                $scope.currentDifficulty = options.currentDifficulty;

                if ($scope.currentState == 'game') { getInitialItems(); }
            }
        });

        $scope.$on('modeChanged', function(event, options) {
            $scope.mode = options.mode;

            if ($scope.currentState == 'game') { getInitialItems(); }
        });

        $scope.$on('currentStateChanged', function(event, options) {
            if (options.currentState != null && options.currentState != $scope.currentState) {
                $scope.currentState = options.currentState;
            }

            if ($scope.currentState == 'game') { getInitialItems(); }
        });

        //-------------------------------------- CLASS METHODS --------------------------------------
        // - These are the main methods used by this controller
        //---------------------------------------------------------------------------------------------

        // Gets an initial set of items
        // - This method should only be used when initially loading the application - or when switching categories / difficulties
        // - The main idea of this method is tha we load a few sets of items very quickly so the user can play with no loag
        // - If you are wishing to just get more items with the existing category / difficulty - use 'getMoreItems()' below
        function getInitialItems() {
            TimerService.stopTimer();
            if (!$scope.currentCategory)
                $scope.currentCategory = CategoryService.getCurrentCategory();

            if(!$scope.currentDifficulty)
                $scope.currentDifficulty = DifficultyService.getCurrentDifficulty();

            return $q(function(resolve) {
                 var success = ItemService.getItemsInTimespan($scope.currentCategory.categoryName, $scope.currentDifficulty.timeSpan, 1, true).then(function(someCurrentItems) {
                     if (someCurrentItems == false) { getInitialItems(); return; }

                    if (someCurrentItems && someCurrentItems.length > 0) { $scope.currentItems = someCurrentItems; }

                    //Update the LoadingService
                    LoadingService.setLoading(false);
                    TimerService.restartTimer();

                    // Now that we got our first set back and the user can play - go ahead and grab two more real quick :)
                    ItemService.getItemsInTimespan($scope.currentCategory.categoryName, $scope.currentDifficulty.timeSpan, 2, false).then(function() {
                        resolve();
                    });
                });

                if (!success) {
                    console.log('failed!');
                }
            });
        }
        // Gets more items with the current category / difficulty
        // - This method will use amount of items currently in the item cache ($scope.Items) to determine how many (if any) new items to pull from the API
        function getMoreItems() {
            if (!$scope.currentCategory)
                $scope.currentCategory = CategoryService.getCurrentCategory();

            if(!$scope.currentDifficulty)
                $scope.currentDifficulty = DifficultyService.getCurrentDifficulty();

            return $q(function(resolve) {
                var numPairs = 0;

                // If we are null (how??) or we don't have any more items - initialize the array and set the loading flag
                if (!$scope.Items || $scope.Items.length == 0) {
                    LoadingService.setLoading(true);
                    $scope.Items = [];
                }

                // This logic is customized to cache items according to the rate the user can flip the cards
                if ($scope.Items.length <= 3) {
                    numPairs = 2;
                } else if ($scope.Items.length <= 5) {
                    numPairs = 3;
                }

                UserService.addRoundPlayed();


                ItemService.getItemsInTimespan($scope.currentCategory.categoryName, $scope.currentDifficulty.timeSpan, numPairs, false).then(function() {
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
                    if ($scope.mode == 'Endless') { HUDService.resetCurrentScore() }
                }
            }
        };

        $scope.getStyle = function(aLabel) {
	        if (aLabel.length > 48) {
		        return {"font-size": "12px"}
            } else if (aLabel.length > 40) {
                return {"font-size": "13px"}
            } else if (aLabel.length > 30) {
                return {"font-size": "18px"}
            } else if (aLabel.length > 20) {
                return {"font-size": "20px"}
            } else {
                return "";
            }
        };

        // This event is called when card flipped from 'front' to 'back'
        $scope.afterFlip = function () {
            $timeout(function () {
                // Flip both of the items back
                $scope.CurrentItems.itemSet.forEach(function (element) {
                    element.flipped = false;
                });
            }, 500);
        };

        // This event is called when card flipped from 'back' to 'front'
        $scope.afterFlop = function () {
            // Bump the current items off the array using 'shiftItems'
            TimerService.restartTimer();
            ItemService.shiftItems().then(function() {
                $scope.imageFlipping = false;

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
