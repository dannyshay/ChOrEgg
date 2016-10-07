angular
    .module('choregg')
    .factory('ModeService', ['$rootScope',function($rootScope) {
        var mode = null;
        var modes = ['Arcade', 'Endless'];

        return {
            getMode: function() {
                // THIS IS ONLY USED IN TEST
                return mode;
            },
            getModes: function() {
                return modes;
            },
            setMode: function(aMode) {
                mode = aMode;
                $rootScope.$broadcast('modeChanged', {mode: mode});
            }
        }
    }]);
