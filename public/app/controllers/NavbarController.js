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

        $scope.$watch(function() {return UserService.getUser();},
            function(aUser) { $scope.user = aUser; }
        );

        $scope.$watch(function() {return UserService.getUsername();},
            function(aUsername) { $scope.username = aUsername; }
        );

        $scope.$watch(function() {return TimerService.getIsPaused();},
            function(aIsPaused) {
                if(aIsPaused != null && aIsPaused != $scope.paused) { $scope.paused = aIsPaused; }
            }
        );

        $scope.$watch(function() {return StateService.getCurrentState();},
            function(aCurrentState) {
                if(aCurrentState != null && aCurrentState != $scope.currentState) { $scope.currentState = aCurrentState; }
            }
        );

        $scope.$watch(function() {return AuthenticationService.getSignedIn();},
            function(aSignedIn) {
                if(aSignedIn != null && aSignedIn != $scope.signedIn) {
                    $scope.signedIn = aSignedIn;
                }
            }
        );

        $scope.viewProfile = function() {
            StateService.setCurrentState('profile');
        };

        $scope.viewMain = function() {
            StateService.setCurrentState('game');
        };

        $scope.viewLeaderboard = function() {
            StateService.setCurrentState(('leaderboard'));
        };

        $scope.difficultyChange = function(aDifficulty) {
            HUDService.initialize();
            DifficultyService.setCurrentDifficulty(aDifficulty);
            TimerService.restartTimer();

        };

        $scope.categoryChange = function(aCategory) {
            HUDService.initialize();
            CategoryService.setCurrentCategory(aCategory);
            TimerService.restartTimer();

        };

        $scope.login = function () {
            GoogleSignin.signIn().then(function (user) {
                AuthenticationService.signInUser(GoogleSignin.getUser());
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