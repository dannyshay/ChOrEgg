// public/js/services/ItemService.js
angular.module('ItemService', []).factory('Item', ['$http', function($http) {
    return {
        // call to get all items
        get : function() {
            return $http.get('/api/items');
        }
    }
}]);