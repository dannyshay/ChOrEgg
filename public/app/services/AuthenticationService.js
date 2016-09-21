angular
    .module('choregg')
    .factory('AuthenticationService', ['$localStorage', 'UserService', function($localStorage, UserService) {
        var signedIn = false;

        if ($localStorage.signedIn != null) {
            signedIn = $localStorage.signedIn;
        }

        return {
            getSignedIn: function() {
                return signedIn;
            },
            signOut: function() {
                signedIn = false;

                $localStorage.signedIn = false;
                $localStorage.user = null;
                $localStorage.username = null;

                UserService.initialize();
            },
            signInUser: function(aUser) {
                signedIn = true;
                $localStorage.signedIn = signedIn;
                
                UserService.signInUser(aUser.w3.U3);
            }
        }
    }]);