// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

    // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'mainController'
        })

    // items page that will use the ItemController
        .when('/items', {
            templateUrl: 'views/item.html',
            controller: 'itemController'
        });

    $locationProvider.html5Mode(true);
}]);

