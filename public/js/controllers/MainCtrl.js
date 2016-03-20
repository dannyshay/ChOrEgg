angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {
   if (!$scope.Items) {
      $http.get("/api/items").success(function(data){
         $scope.Items = data;
      });
   };

   $scope.imgClick = function($index) {
      switch ($index) {
         case 0:
             alert('image 1 clicked!');
              break;
         case 1:
            alert('image 2 clicked!');
              break;
         default:
              break;
      }
   };
});