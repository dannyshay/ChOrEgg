angular
    .module('choregg')
    .factory('AuthenticationService', ['$localStorage',function($localStorage) {
        var signedIn = false;
        var user = null;
        var username = null;

        if ($localStorage.signedIn != null) {
            signedIn = $localStorage.signedIn;
        }

        if ($localStorage.username != null) {
            if (signedIn) {
                username = $localStorage.username;
            }
        }

        return {
            getSignedIn: function() {
                return signedIn;
            },
            signOut: function() {
                signedIn = false;
                user = null;
                username = null;

                $localStorage.signedIn = false;
                $localStorage.username = null;
            },
            getUser: function() {
                return user;
            },
            getUsername: function() {
                return username;
            },
            signInUser: function(aUser) {
                user = aUser;
                username = aUser.w3.U3;
                signedIn = true;

                $localStorage.signedIn = true;
                $localStorage.username = username;
            }
        }
    }]);