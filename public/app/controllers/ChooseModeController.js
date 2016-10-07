angular
    .module('choregg')
    .controller('ChooseModeController', ['$scope', 'StateService', 'ModeService', 'LoadingService', function($scope, StateService, ModeService, LoadingService) {
        $scope.modes = ModeService.getModes();

        $scope.$on('loadingChanged', function(event, options) {
            if (options.loading != null && options.loading != $scope.loading) {
                $scope.loading = options.loading;
            }
        });

        $scope.viewGame = function(aMode) {
            LoadingService.setLoading(true);
            ModeService.setMode(aMode);
            StateService.setCurrentState('game');
        }
    }]);