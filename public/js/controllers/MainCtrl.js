angular.module('MainCtrl', []).controller('MainController', function ($scope, $http, $cookies, $analytics, $timeout) {
    if ($scope.score == undefined) {
        $http.get('/api/user/getScore').success(function (data) {
            $scope.score = parseInt(data);
        });
    }

    var categories = $cookies.get('categories');
    if (!categories || categories == undefined) {
        $http.get('/api/items/categories').success(function (data) {
            categories = data;
            $cookies.put('categories', JSON.stringify(data));

            $scope.categories = categories;

            loadPage();
        });
    } else {
        categories = JSON.parse(categories);

        $scope.categories = categories;

        loadPage();
    }

    function loadPage() {
        var difficulties = $cookies.get('difficulties');
        if(!difficulties || difficulties == undefined) {
            $http.get('/api/difficulties').success(function(data) {
                difficulties = data;
                $cookies.put('difficulties', JSON.stringify(data));

                $scope.difficulties = difficulties;

                loadItems();
            });
        } else {
            difficulties = JSON.parse(difficulties);

            $scope.difficulties = difficulties;

            loadItems();
        }
    }

    function loadItems() {
        if (!$scope.currentCategory) {
            $scope.currentCategory = $scope.categories[0];
        }

        if (!$scope.currentDifficulty) {
            $scope.currentDifficulty = $scope.difficulties[0];
        }

        var apiString = '/api/items/getTwoItemsInTimespan?category=' + $scope.currentCategory + '&timeSpan=' + $scope.currentDifficulty.timeSpan;
        if ($scope.Items) {
            apiString += '&oldID1=' + $scope.Items[0]._id + '&oldID2=' + $scope.Items[1]._id;
        }

        $http.get(apiString).success(function (data) {
            $scope.Items = data;
        });
    }

    $scope.ClearCookies = function () {
        $cookies.put('imagesLoaded', '');
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
        loadItems();
    }

    $scope.categoryChange = function (category) {
        $scope.currentCategory = category;
        loadItems();
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

    var resetItems = function () {
        $scope.imageFlipped = false;
        $scope.Items.forEach(function (element) {
            element.flipped = false;
        });
    };

    $scope.afterFlip = function () {
        $timeout(function () {
            resetItems()
            loadItems();
        }, 2000);
    };

    $scope.afterFlop = function () {
        //loadItems();
    };
}).directive('myFlip', function ($animate) {
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