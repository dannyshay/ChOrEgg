angular
    .module('choregg')
    .factory('AuthenticationService', ['$localStorage', 'UserService', '$rootScope', function($localStorage, UserService, $rootScope) {
        var signedIn = false;

        if ($localStorage.signedIn != null) {
            signedIn = $localStorage.signedIn;
        }

        return {
            getSignedIn: function() {
                // THIS IS ONLY USED FOR TEST
                return signedIn;
            },
            signOut: function() {
                signedIn = false;
                $rootScope.$broadcast('signedInChanged', {signedIn: signedIn});

                $localStorage.signedIn = false;
                $localStorage.user = null;

                UserService.initialize();
            },
            signIn: function(aUser) {
                signedIn = true;
                $rootScope.$broadcast('signedInChanged', {signedIn: signedIn});
                $localStorage.signedIn = signedIn;
                
                UserService.setUser(aUser.w3.U3);
            }
        }
    }]);