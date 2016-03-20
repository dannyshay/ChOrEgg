angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {
    var category = "People";

    if (!$scope.numItems) {
       $http.get("/api/items/" + category + "/getCount").success(function(data){
           $scope.numItems = parseInt(data);

           getTwoItems();
       });
    };

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

   $scope.imgClick = function($index) {
      switch ($index) {
         case 1:
             alert('image 1 clicked!');
              break;
         case 2:
            alert('image 2 clicked!');
              break;
         default:
              break;
      }
   };
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}