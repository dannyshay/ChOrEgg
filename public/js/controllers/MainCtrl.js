var category = "People";

angular.module('MainCtrl', []).controller('MainController', function ($scope, $http, $cookies, $analytics) {
    var numItems = parseInt($cookies.get('numItems'));

    if ($scope.score == undefined) {
        $http.get('/api/user/getScore').success(function(data) {
           $scope.score = parseInt(data);
        });
    }

    if (isNaN(numItems) || numItems == 0) {
        //We are starting cold here - get the number of API items
        $http.get("/api/items/" + category + "/count").success(function (data) {
            $scope.numItems = parseInt(data);
            $cookies.put('numItems', $scope.numItems);

            loadItems();
        });
    } else {
        $scope.numItems = numItems;

        loadItems();
    }

    function loadItems() {
        loadImages();
        getTwoRandomItems();
    }

    function loadImages() {
        if (!$cookies.get('imagesLoaded')) {
            $http.get('/api/items/getImages').success(function (data) {
                data.forEach(function (k) {
                    preload(k);
                });
            });
            $cookies.put('imagesLoaded', true);
        }
    }

    function getTwoRandomItems() {
        var num1 = getRandomInt(1, $scope.numItems);
        var num2 = 0;
        var oldNum1 = 0;
        var oldNum2 = 0;
        $scope.Items = [];

        if ($cookies.get('num1')) {
            oldNum1 = parseInt($cookies.get('num1'));
            oldNum2 = parseInt($cookies.get('num2'))
        }

        while ((oldNum1 != 0 && num1 == oldNum1) || (oldNum2 != 0 && num1 == oldNum2)) {
            num1 = getRandomInt(1, $scope.numItems);
        }

        while ((num2 == 0 || num2 == num1) || (oldNum1 != 0 && num2 == oldNum1) || (oldNum2 != 0 && num2 == oldNum2)) {
            num2 = getRandomInt(1, $scope.numItems);
        }

        $http.get("/api/items/" + category + "/" + num1).success(function (data) {
            $scope.Items[0] = data[0];
            $scope.Items[0].flipped = false;
        });

        $http.get("/api/items/" + category + "/" + num2).success(function (data) {
            $scope.Items[1] = data[0];
            $scope.Items[1].flipped = false;
        });

        $cookies.put('num1', num1);
        $cookies.put('num2', num2);
    }

    $scope.imgClick = function ($index) {
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
    };

    $scope.afterFlop = function () {
        if ($scope.Items[0].flipped == $scope.Items[1].flipped) {
            getTwoRandomItems();
        }
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
                    $animate.addClass(element, "flipped");
                }
                if (!flip && OldFlipped) {
                    $animate.removeClass(element, "flipped").then(scope.afterFlop);
                }
            });
        }
    }
});