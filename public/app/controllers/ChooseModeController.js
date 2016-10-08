angular
    .module('choregg')
    .controller('ChooseModeController', ['$scope', 'StateService', 'ModeService', function($scope, StateService, ModeService) {
        $scope.modes = ModeService.getModes();

        $scope.$on('loadingChanged', function(event, options) {
            if (options.loading != null && options.loading != $scope.loading) {
                $scope.loading = options.loading;
            }
        });

        $scope.viewChooseCategory = function(aMode) {
            ModeService.setMode(aMode);
            StateService.setCurrentState('chooseCategory');
        };
    }]);