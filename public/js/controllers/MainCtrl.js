angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {
   if (!$scope.Items) {
      $http.get("http://localhost:8080/api/items").success(function(data){
         $scope.Items = data;
         console.log(data);
      });
   };
});