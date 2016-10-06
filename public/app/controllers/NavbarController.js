//Boostrap mobile dropdown fix
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') && ( $(e.target).attr('class') != 'dropdown-toggle' ) ) {
        $(this).collapse('hide');
    }
});

//Same fix for the main button
$(document).on('click', '.navbar-brand', function(e) {
   $('.navbar-collapse').collapse('hide');
});

angular
    .module('choregg')
    .config(['GoogleSigninProvider', function(GoogleSigninProvider) {
        GoogleSigninProvider.init({
            client_id: '271196145347-2s58ab7cb31bh18m3u55d67ju1lmcq1f.apps.googleusercontent.com'
        });
    }])
    .controller('NavbarController', ['$scope', '$rootScope', 'CategoryService', 'DifficultyService', 'HUDService', 'ItemService', 'TimerService', 'GoogleSignin', 'AuthenticationService','UserService', 'StateService', function($scope, $rootScope, CategoryService, DifficultyService, HUDService, ItemService, TimerService, GoogleSignin, AuthenticationService, UserService, StateService) {
        $scope.$on('categoriesLoaded', function(event, options) {
            $scope.categories = options.categories;
        });

        $scope.$on('difficultiesLoaded', function(event, options) {
            $scope.difficulties = options.difficulties;
        });

        $scope.$on('currentCategoryChanged', function(event, options) {
            $scope.currentCategory = options.currentCategory;
        });

        $scope.$on('currentDifficultyChanged', function(event, options) {
            $scope.currentDifficulty = options.currentDifficulty;
        });

        $scope.$on('userChanged', function(event, options) {
            $scope.user = options.user;
            $scope.username = $scope.user.username;
        });

        $scope.$on('isPausedChanged', function(event, options) {
            $scope.isPaused = options.isPaused;
        });

        $scope.$on('currentStateChanged', function(event, options) {
            $scope.currentState = options.currentState;
        });

        $scope.$on('signedInChanged', function(event, options) {
            $scope.signedIn = options.signedIn;
        });

        $scope.viewProfile = function() {
            StateService.setCurrentState('profile');
        };

        $scope.viewMain = function() {
            StateService.setCurrentState('game');
        };

        $scope.viewLeaderboard = function() {
            StateService.setCurrentState('leaderboard');
        };

        $scope.viewSplash = function() {
            HUDService.initialize();
            StateService.setCurrentState('splash');
        };

        $scope.difficultyChange = function(aDifficulty) {
            HUDService.initialize();
            DifficultyService.setCurrentDifficulty(aDifficulty);
            TimerService.restartTimer();
        };

        $scope.categoryChange = function(aCategory) {
            HUDService.initialize();
            CategoryService.setCurrentCategory(aCategory);

        };

        $scope.handleDifficultyColor = function(aDifficulty) {
            switch (aDifficulty.difficultyName) {
                case "Easy":
                    return {color:'green'}
                    break;
                case "Medium":
                    return {color:'orange'}
                    break;
                case "Hard":
                    return {color:'red'}
                    break;
                default:
                    break;
            }
        };

        $scope.handleCategoryIcons = function(aCategory) {
            switch (aCategory.categoryName) {
                case "People":
                    return 'fa fa-users';
                    break;
                case "Inventions":
                    return 'fa fa-gears';
                    break;
                case "Monuments":
                    return 'fa fa-institution';
                    break;
                default:
                    break;
            }
        }

        $scope.viewChooseCategory = function() {
            HUDService.initialize();
            StateService.setCurrentState('chooseCategory');
        };

        $scope.login = function () {
            GoogleSignin.signIn().then(function (user) {
                AuthenticationService.signIn(GoogleSignin.getUser());
            }, function (err) {
                AuthenticationService.signOut();
            });
        };

        $scope.logout = function() {
            GoogleSignin.disconnect();
            AuthenticationService.signOut();
        };

        $scope.pause = function() {
            TimerService.pause();
        };

        $scope.resume = function() {
            TimerService.resume();
        };

        $scope.isActiveCategory = function (category) {
            return $scope.currentCategory == category;
        };

        $scope.isActiveDifficulty = function (difficulty) {
            return $scope.currentDifficulty == difficulty;
        };
    }]);