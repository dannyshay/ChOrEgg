angular.module('choregg', []).factory('ItemService', ['$http', function($http) {
    return {
        // call to get all items
        get : function() {
            return $http.get('/api/items');
        }
    }
}]);