angular
    .module("choregg")
    .factory("choreggAPI", ["$resource", function ($resource) {
        // Wraps the API into something friendly we can call in the Services
        return {
            Categories: $resource('/api/items/categories'),
            Difficulties: $resource('/api/difficulties'),
            GetItemsInTimespan: $resource('/api/items/getItemsInTimespan'),
            Users: $resource('/api/users'),
            User: $resource('/api/users/:aUsername', null,
                {
                    'update' : {method: 'PUT'},
                })
        };
    }]);