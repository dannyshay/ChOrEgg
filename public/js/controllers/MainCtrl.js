var category = "People";

angular.module('MainCtrl', []).controller('MainController', function ($scope, $http, $cookies, $analytics, $timeout) {
    if ($scope.score == undefined) {
        $http.get('/api/user/getScore').success(function(data) {
           $scope.score = parseInt(data);
        });
    }

    loadImages();
    loadItems();

    function loadImages() {
        if (!$cookies.get('imagesLoaded')) {
            $http.get('/api/items/images').success(function (data) {
                data.forEach(function (k) {
                    preload(k);
                });
            });
            $cookies.put('imagesLoaded', true);
        }
    }

    function loadItems() {
        $http.get('/api/items/getTwoItems?category=' + category + '&timeSpan=15').success(function (data) {
            $scope.Items = data;
        });
    }

    $scope.ClearCookies = function() {
        $cookies.put('imagesLoaded', '');
        alert('Cookies cleared!');
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

    var resetItems = function () {
        console.log('resetting items');
        $scope.Items.forEach(function(element) {
           element.flipped = false;
        });
        loadItems();
        $cookies.put('flipping', '');
    };

    $scope.afterFlip = function(myIndex) {
        $timeout(function () {resetItems()}, 2000);
    };

    $scope.afterFlop = function () {
        //if ($scope.Items[0].flipped == $scope.Items[1].flipped) {
        //    loadItems();
        //}
    };
}).directive('myFlip', function ($animate) {
    return {
        scope: {
            'myFlip': '=',
            'afterFlip': '&',
            'afterFlop': '&',
            index: '='
        },
        link: function (scope, element) {
            scope.$watch("myFlip", function (flip, OldFlipped) {
                if (flip) {
                    $animate.addClass(element, "flipped").then(scope.afterFlip({$index:scope.index}));
                }
                if (!flip && OldFlipped) {
                    $animate.removeClass(element, "flipped").then(scope.afterFlop);
                }
            });
        }
    }
});