angular
    .module('choregg')
    .factory('LoadingService', ['$rootScope',function($rootScope) {
        var loading = false;

        return {
            getLoading: function() {
                // THIS IS ONLY USED IN TEST
                return loading;
            },
            setLoading: function(aLoading) {
                loading = aLoading;
                $rootScope.$broadcast('loadingChanged', {loading: loading});
            }
        }
    }]);
