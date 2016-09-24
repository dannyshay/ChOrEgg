angular
    .module('choregg')
    .factory('LoadingService', ['$rootScope',function($rootScope) {
        var loading = false;

        return {
            setLoading: function(aLoading) {
                loading = aLoading;
                $rootScope.$broadcast('loadingChanged', {loading: loading});
            }
        }
    }]);
