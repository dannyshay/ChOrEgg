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
                            console.log(data);
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
        }

        //Get Two Random Items
        function getTwoItems() {
            if (!$scope.currentCategory) {
                $scope.currentCategory = $scope.categories[0];
            }

            if (!$scope.currentDifficulty) {
                $scope.currentDifficulty = $scope.difficulties[0];
            }

            var args = {
                category: $scope.currentCategory,
                timeSpan: $scope.currentDifficulty.timeSpan
            };

            if ($scope.Items) {
                args.oldID1 =  $scope.Items[0]._id;
                args.oldID2 = $scope.Items[1]._id;
            }

            choreggAPI.TwoRandomItems.get({category:$scope.currentCategory, timeSpan:$scope.currentDifficulty.timeSpan}, function(data) {
                $scope.Items = data.Items;
            });
        }

        //Flip images back to the 'front' side of the cards
        var resetItems = function () {
            $scope.imageFlipped = false;
            $scope.Items.forEach(function (element) {
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
            getTwoItems();
        }

        $scope.categoryChange = function (category) {
            $scope.currentCategory = category;
            getTwoItems();
        }

        $scope.imgClick = function ($index) {
            if (!$scope.imageFlipped) {
                $scope.imageFlipped = true;
                $analytics.eventTrack('Image ' + $index + ' Clicked');

                var clickedItem;
                var otherItem;
                var needsNewItems = false;

                $scope.Items[0].correct = ($scope.Items[0].date < $scope.Items[1].date);
                $scope.Items[1].correct = ($scope.Items[0].date >= $scope.Items[1].date);

                clickedItem = $scope.Items[$index];
                otherItem = $scope.Items[($index == 0 ? 1 : 0)];

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
                    }
                }
            }
        };

        //Called when card flipped from 'front' to 'back'
        $scope.afterFlip = function () {
            $timeout(function () {
                resetItems();
                getTwoItems();
            }, 500);
        };

        //Called when card flipped from 'back' to 'front'
        $scope.afterFlop = function () {
        };

        //--EXECUTED SCRIPT

        loadDifficulties().then(function(){loadCategories().then(function(){getTwoItems()})});

        //loadCategories().then(loadDifficulties()).then(getTwoItems());
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