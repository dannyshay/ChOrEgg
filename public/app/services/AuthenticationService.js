angular
    .module('choregg')
    .factory('AuthenticationService', [function() {
        var signedIn = false;
        var user = null;
        var username = null;

        return {
            getSignedIn: function() {
                return signedIn;
            },
            signOut: function() {
                signedIn = false;
                user = null;
                username = null;
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
            }
        }
    }]);