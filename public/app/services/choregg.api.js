angular
    .module("choregg")
    .factory("choreggAPI", ["$resource", '$http', function ($resource, $http) {
        // Wraps the API into something friendly we can call in the Services
        return {
            Categories: $resource('/api/categories', null,
                {
                    'query' : {method: 'GET', isArray:true}
                }),
            Difficulties: $resource('/api/difficulties', null,
                {
                    'query' : {method: 'GET', isArray:true}
                }),
            GetItemsInTimespan: $resource('/api/items/getItemsInTimespan', null,
                {
                    'query': {method: 'GET', isArray:true}
                }),
            Users: $resource('/api/users', null,
                {
                    'query' : {method: 'GET', isArray:true}
                }),
            User: $resource('/api/users/:aUsername', null,
                {
                    'update' : {method: 'PUT'},
                }),
            GetUsersByHighScore: $resource('/api/users/getUsersByHighScore', null,
                {
                    'query' : {method: 'GET', isArray:true}
                }),
            DeleteAllItems: function() {
                return $http.get('/api/items/deleteAllItems');
            },
            AddItems: function(someItems) {
                return $http.post('/api/items/addItems', someItems);
            },
            DownloadAndFormatImages: function() {
                return $http.get('/api/downloadAndFormatImages');
            }
        };
    }]);