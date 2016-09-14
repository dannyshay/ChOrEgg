angular
    .module('choregg')
    .factory('LoadingService', [function() {
        var loading = false;

        return {
            getLoading: function() {
                return loading;
            },
            setLoading: function(aLoading) {
                loading = aLoading;
            }
        }
    }]);
