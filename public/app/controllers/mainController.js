angular
    .module('choregg')
    .controller('MainController', ['$scope', '$http', '$cookies', '$analytics', '$timeout', 'choreggAPI', '$q', function ($scope, $http, $cookies, $analytics, $timeout, choreggAPI, $q) {
        //--PAGE Functions

        //Load Categories either from cookies or from API
        var loadCategories = function () {
            return $q(function (resolve) {
                    var categories = $cookies.get('categories');
                    if (!categories || categories == undefined) {
                        choreggAPI.Categories.get(function (data) {
                            categories = data.Categories;
                            $cookies.put('categories', JSON.stringify(categories));

                            $scope.categories = categories;

                            resolve();
                        });
                    } else {
                        categories = JSON.parse(categories);

                        $scope.categories = categories;

                        resolve();
                    }
                }
            );
        };

        $scope.timeRemaining = 90;
        var mytimeout = null; // the current timeoutID
        // actual timer method, counts down every second, stops on zero
        $scope.onTimeout = function() {
            if($scope.timeRemaining ===  0) {
                $scope.$broadcast('timer-stopped', 0);
                $timeout.cancel(mytimeout);
                return;
            }
            $scope.timeRemaining--;
            mytimeout = $timeout($scope.onTimeout, 1000);
        };

        var startTimer = function() {
            mytimeout = $timeout($scope.onTimeout, 1000);
        };
        // stops and resets the current timer
        var stopTimer = function() {
            $scope.$broadcast('timer-stopped', $scope.timeRemaining);
            //$scope.timeRemaining = 10;
            $timeout.cancel(mytimeout);
        };

        var resetTimer = function() {
            $scope.timeRemaining = 10;
            startTimer();
        };
        // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
        $scope.$on('timer-stopped', function(event, remaining) {
            if(remaining === 0) {
                console.log('your time ran out!');
            }
        });

        //Load Difficulties either from cookies or from API
        var loadDifficulties = function() {
            return $q(function(resolve) {
                var difficulties = $cookies.get('difficulties');
                if (!difficulties || difficulties == undefined) {
                    choreggAPI.Difficulties.get(function (data) {
                        difficulties = data.Difficulties;
                        $cookies.put('difficulties', JSON.stringify(difficulties));

                        $scope.difficulties = difficulties;

                        resolve();
                    });
                } else {
                    difficulties = JSON.parse(difficulties);

                    $scope.difficulties = difficulties;

                    resolve();
                }
            })
        };

        var loadItems = function() {
            return $q(function(resolve) {
                $scope.loading = true;
                $scope.score = 0;

                if (!$scope.currentDifficulty) {$scope.currentDifficulty = $scope.difficulties[0];}
                if (!$scope.currentCategory ) {$scope.currentCategory = $scope.categories[0];}

                $scope.strikes = 0;

                choreggAPI.GetItemsInTimespan.get({category:$scope.currentCategory, timeSpan:$scope.currentDifficulty.timeSpan, numPairs:1}, function(data) {
                    $scope.loading = false;
                    $scope.Items = data.Items;
                    $scope.timeRemaining = 10;
                    startTimer();
                    choreggAPI.GetItemsInTimespan.get({category:$scope.currentCategory, timeSpan:$scope.currentDifficulty.timeSpan, numPairs:2}, function(data2) {
                        data2.Items.forEach(function(item) {
                            $scope.Items.push(item);
                            resolve();
                        });
                    });
                });
            });
        };

        //Get Two Random Items
        function getItems() {
            if($scope.Items) {
                var numPairs = 0;
                if ($scope.Items.length == 0) { $scope.loading = true; }

                if ($scope.Items.length <= 2) {
                    numPairs = 3;
                } else if ($scope.Items.length <= 5) {
                    numPairs = 5;
                } else if ($scope.Items.length <= 10) {
                    numPairs = 10;
                }

                choreggAPI.GetItemsInTimespan.get({category:$scope.currentCategory, timeSpan:$scope.currentDifficulty.timeSpan, numPairs:numPairs}, function(data) {
                    $scope.loading = false;
                    data.Items.forEach(function(item) {
                        $scope.Items.push(item);
                    });
                });
            } else {
                $scope.loading = true;
                choreggAPI.GetItemsInTimespan.get({category:$scope.currentCategory, timeSpan:$scope.currentDifficulty.timeSpan, numPairs:1}, function(data) {
                   $scope.loading = false;
                   $scope.Items = data.Items;
                });
            }
        }

        //Flip images back to the 'front' side of the cards
        var resetItems = function () {
            $scope.imageFlipped = false;
            $scope.Items[0].itemSet.forEach(function (element) {
                element.flipped = false;
            });
        };

        //--SCOPE Functions--

        //Clear all cookies in the current context
        $scope.ClearCookies = function () {
            $cookies.put('categories', '');
            $cookies.put('difficulties', '');
            alert('Cookies cleared!');
        }

        $scope.isActiveCategory = function (category) {
            return $scope.currentCategory == category;
        }

        $scope.isActiveDifficulty = function (difficulty) {
            return $scope.currentDifficulty == difficulty;
        }

        $scope.difficultyChange = function (difficulty) {
            $scope.currentDifficulty = difficulty;
            $scope.Items = null;
            loadItems();
        }

        $scope.categoryChange = function (category) {
            $scope.currentCategory = category;
            $scope.Items = null;
            loadItems();
        }

        $scope.getNumber = function(number) {
            return new Array(number);
        }

        $scope.imgClick = function ($index) {
            stopTimer();
            if (!$scope.imageFlipped) {
                $scope.imageFlipped = true;
                $analytics.eventTrack('Image ' + $index + ' Clicked');

                var clickedItem;
                var otherItem;
                var needsNewItems = false;

                $scope.Items[0].itemSet[0].correct = ($scope.Items[0].itemSet[0].date < $scope.Items[0].itemSet[1].date);
                $scope.Items[0].itemSet[1].correct = ($scope.Items[0].itemSet[0].date >= $scope.Items[0].itemSet[1].date);

                clickedItem = $scope.Items[0].itemSet[$index];
                otherItem = $scope.Items[0].itemSet[($index == 0 ? 1 : 0)];

                clickedItem.flipped = !clickedItem.flipped;

                if (!clickedItem.flipped) {
                    needsNewItems = true
                }
                if (!needsNewItems) {
                    if (clickedItem.date < otherItem.date) {
                        $analytics.eventTrack('User choice - Correct');
                        $scope.score = parseInt($scope.score) + 1;
                    } else {
                        $analytics.eventTrack('User choice - Wrong');
                        $scope.score = 0;
                        $scope.strikes += 1;
                    }
                }

                if ($scope.strikes >= 5) {
                    alert('GAME OVER!!');
                    $scope.strikes = 0;
                }
            }
        };

        //Called when card flipped from 'front' to 'back'
        $scope.afterFlip = function () {
            $timeout(function () {
                resetItems();
            }, 500);
        };

        //Called when card flipped from 'back' to 'front'
        $scope.afterFlop = function () {
            $scope.Items.shift();
            getItems();
            resetTimer();
        };

        //--EXECUTED SCRIPT
        loadDifficulties().then(function(){
            loadCategories().then(function(){
                loadItems();
            })
        });
    }])
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