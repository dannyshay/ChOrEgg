// public/js/services/ItemService.js
angular.module('ItemService', []).factory('Item', ['$http', function($http) {
    return {
        // call to get all items
        get : function() {
            return $http.get('/api/items');
        },

            // these will work when more API routes are defined on the Node side of the
        //call to POST and create a new item

        create : function(itemData) {
            return $http.post('/api/items', itemData);
        },

        // call to DELETE an item

        delete : function(id) {
            return $http.delete('/api/items/' + id);
        }
    }
}]);