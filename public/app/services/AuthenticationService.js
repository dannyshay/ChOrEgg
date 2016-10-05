angular
    .module('choregg')
    .factory('AuthenticationService', ['$localStorage', 'UserService', '$rootScope', function($localStorage, UserService, $rootScope) {
        var signedIn = false;

        if ($localStorage.signedIn != null) {
            signedIn = $localStorage.signedIn;
        }

        return {
            signOut: function() {
                signedIn = false;
                $rootScope.$broadcast('signedInChanged', {signedIn: signedIn});

                $localStorage.signedIn = false;
                $localStorage.user = null;
                $localStorage.username = null;

                UserService.initialize();
            },
            setUser: function(aUser) {
                signedIn = true;
                $rootScope.$broadcast('signedInChanged', {signedIn: signedIn});
                $localStorage.signedIn = signedIn;
                
                UserService.setUser(aUser.w3.U3);
            }
        }
    }]);