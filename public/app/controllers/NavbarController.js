angular
    .module('choregg')
    .controller('NavbarController', ['$scope', '$rootScope', 'CategoryService', 'DifficultyService', 'HUDService', 'ItemService', 'TimerService', function($scope, $rootScope, CategoryService, DifficultyService, HUDService, ItemService, TimerService) {
        // DifficultyService.loadDifficulties().then(function(){
        //     CategoryService.loadCategories().then(function(){
        //         $scope.categories = CategoryService.getCategories();;
        //         $scope.difficulties = DifficultyService.getDifficulties();
        //     });
        // });

        $scope.$watch(function() {return CategoryService.getCategories();},
            function(aCategories) { $scope.categories = aCategories; }
        );

        $scope.$watch(function() {return DifficultyService.getDifficulties();},
            function(aDifficulties) { $scope.difficulties = aDifficulties; }
        );

        $scope.$watch(function() {return CategoryService.getCurrentCategory();},
            function(aCategory) { if(aCategory) {$scope.currentCategory = aCategory; }}
        );

        $scope.$watch(function() {return DifficultyService.getCurrentDifficulty();},
            function(aDifficulty) { if(aDifficulty) {$scope.currentDifficulty = aDifficulty; }}

        );

        $scope.difficultyChange = function(aDifficulty) {
            TimerService.restartTimer();
            HUDService.initialize();
            DifficultyService.setCurrentDifficulty(aDifficulty);

        };

        $scope.categoryChange = function(aCategory) {
            TimerService.restartTimer();
            HUDService.initialize();
            CategoryService.setCurrentCategory(aCategory);

        };

        $scope.isActiveCategory = function (category) {
            return $scope.currentCategory == category;
        };

        $scope.isActiveDifficulty = function (difficulty) {
            return $scope.currentDifficulty == difficulty;
        };
    }]);