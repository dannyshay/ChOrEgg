angular
    .module('choregg')
    .factory('LoadingService', ['$rootScope',function($rootScope) {
        var loading = false;

        return {
            getLoading: function() {
                return loading;
            },
            setLoading: function(aLoading) {
                loading = aLoading;
                $rootScope.$broadcast('loadingChanged');
            }
        }
    }]);
