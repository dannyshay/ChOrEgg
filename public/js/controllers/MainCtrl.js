angular.module('MainCtrl', []).controller('MainController', function($scope, $http, $cookies, $analytics) {
    var category = "People";
    var numItems = parseInt($cookies.get('numItems'));
    var score = $scope.Score;

    if (isNaN(score) || score == 0) {
        $scope.Score = 0;
    }

    if (isNaN(numItems) || numItems == 0) {
       $http.get("/api/items/" + category + "/count").success(function(data){
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
            $http.get('/api/items/getImages').success(function(data) {
                data.forEach(function(k, v) {
                    preload(v)
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

        if ($cookies.get('num1')) {
            oldNum1 = parseInt($cookies.get('num1'));
            oldNum2 = parseInt($cookies.get('num2'))
        }

        while ((oldNum1 != 0 && num1 == oldNum1) || (oldNum2 != 0 && num1 == oldNum2)) {
            num1 = getRandomInt(1, $scope.numItems);
        }

        while ((num2 == 0 || num2 == num1) || (oldNum1 != 0 && num2 == oldNum1) || (oldNum2 != 0 && num2 == oldNum2))  {
            num2 = getRandomInt(1, $scope.numItems);
        }

        $http.get("/api/items/" + category + "/" + num1).success(function(data) {
            $scope.Item1 = data[0];
        });

        $http.get("/api/items/" + category + "/" + num2).success(function(data) {
            $scope.Item2 = data[0];
        });

        $cookies.put('num1', num1)
        $cookies.put('num2', num2);
    };

    function preload() {
        var images = Array();
        for (var i = 0; i < preload.arguments.length; i++) {
            images[i] = new Image()
            images[i].src = preload.arguments[i]
        }
    }

   $scope.imgClick = function($index) {
       $analytics.eventTrack('Image ' + $index +  ' Clicked')

       var clickedItem;
       var otherItem;
       var needsNewItems = false;

       $scope.Item1Correct = ($scope.Item1.date < $scope.Item2.date);
       $scope.Item2Correct = ($scope.Item1.date >= $scope.Item2.date);

      switch ($index) {
         case 1:
             clickedItem = $scope.Item1;
             otherItem = $scope.Item2;

             $scope.isFlipped=!$scope.isFlipped;

             if (!$scope.isFlipped) {needsNewItems = true};
              break;
         case 2:

             clickedItem = $scope.Item2;
             otherItem = $scope.Item1;

             $scope.isFlipped2=!$scope.isFlipped2;

             if (!$scope.isFlipped2) {needsNewItems = true};
              break;
         default:
              break;
      }
       if (!needsNewItems) {
           if (clickedItem.date < otherItem.date) {
               $analytics.eventTrack('User choice - Correct');
               $scope.Score = parseInt($scope.Score) + 1;
           } else {
               $analytics.eventTrack('User choice - Wrong');
               $scope.Score = 0;
           }
       } else {
           getTwoRandomItems();
       };
   };
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}