angular
    .module("choregg")
    .factory("choreggAPI", ["$resource", function ($resource) {
        return {
            Categories: $resource('/api/items/categories'),
            Difficulties: $resource('/api/difficulties'),
            GetItemsInTimespan: $resource('/api/items/getItemsInTimespan')
        };
    }]);