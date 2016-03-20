// public/js/controllers/ItemCtrl.js

angular.module('itemCtrl', []).controller('itemController', function($scope, $http) {
   $scope.tagLine = 'Nothing beats a pocket protector!';

   $scope.Save = function() {
      $http.get("http://localhost:8080/api/items", {"msg": "hi"}).success(function(data) {
         console.log(data);
      });
   };
});