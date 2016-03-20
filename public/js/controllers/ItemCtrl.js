// public/js/controllers/ItemCtrl.js

angular.module('ItemCtrl', []).controller('ItemController', function($scope, $http) {
   $scope.tagLine = 'Nothing beats a pocket protector!';

   if (!$scope.Items) {
      $http.get("http://localhost:8080/api/items").success(function(data){
         $scope.Items = data;
         console.log(data);
      });
   };
});