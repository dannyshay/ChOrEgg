angular.module('MainCtrl', []).controller('MainController', function($scope, $http, $cookies) {
    var category = "People";

    if (!$cookies.get('numItems')) {
       $http.get("/api/items/" + category + "/getCount").success(function(data){
           $scope.numItems = parseInt(data);
           $cookies.put('numItems', $scope.numItems);
       });
    } else {
        $scope.numItems = parseInt($cookies.get('numItems'));
    };

    if (!$cookies.get('imagesLoaded')) {
        $.ajax('/api/items/getImages').done(function(data) {
            $.each(data, function(k, v) {
                preload(v);
            });
        }).fail(function() {
            $cookies.remove('imagesLoaded');
        });
        $cookies.put('imagesLoaded', true);
    }

    getTwoItems();

    function getTwoItems() {
        var num1 = getRandomInt(1, $scope.numItems);
        var num2 = 0;

        while (num2 == 0 || num2 == num1) {
            num2 = getRandomInt(1, $scope.numItems);
        }

        $http.get("/api/items/" + category + "/" + num1).success(function(data) {
            $scope.Item1 = data[0];
        });

        $http.get("/api/items/" + category + "/" + num2).success(function(data) {
            $scope.Item2 = data[0];
        });
    };

    function preload() {
        var images = Array();
        for (var i = 0; i < preload.arguments.length; i++) {
            images[i] = new Image()
            images[i].src = preload.arguments[i]
        }
    }

   $scope.imgClick = function($index) {
       var clickedItem;
       var otherItem;
      switch ($index) {
         case 1:
             clickedItem = $scope.Item1;
             otherItem = $scope.Item2;
              break;
         case 2:

             clickedItem = $scope.Item2;
             otherItem = $scope.Item1;
              break;
         default:
              break;
      }
       if (clickedItem.date < otherItem.date) {
           alert('Correct!   ' + clickedItem.name + ' (' +  clickedItem.date + ') was born before ' + otherItem.name + ' (' + otherItem.date + ')');
       } else {
           alert('Wrong.   ' + clickedItem.name + ' (' +  clickedItem.date + ') was born after ' + otherItem.name + ' (' + otherItem.date + ')');
       }

       location.reload();
   };
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}