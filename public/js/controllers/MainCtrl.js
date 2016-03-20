angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {
   if (!$scope.Items) {
      $http.get("/api/items").success(function(data){
         $scope.Items = data;
      });
   };
});