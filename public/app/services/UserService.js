angular
    .module('choregg')
    .factory('UserService', ['$localStorage', 'choreggAPI','$q', '$rootScope', function($localStorage, choreggAPI, $q, $rootScope) {
        var user = null;
        var users = null;

        if ($localStorage.user)
            user = $localStorage.user;

        if ($localStorage.users)
            users = $localStorage.users;

        var refreshUsers = function() {
            choreggAPI.GetUsersByHighScore.query({numUsers: 20}, function(data) {
                if(data != null && data != null && data != users) {
                    users = data;
                    $rootScope.$broadcast('usersChanged', {users: users});
                    $localStorage.users = users;
                }
            });
        };

        refreshUsers();

        var createNewUser = function(aUsername) {
            var today = new Date();
            var myFormattedTodayDate = (("00" + (today.getMonth() + 1)).slice(-2)) + '/' + (("00" + (today.getDate())).slice(-2)) + '/' + today.getFullYear();

            return {
                username: aUsername,
                createdDate: myFormattedTodayDate,
                lastSignInDate: myFormattedTodayDate,
                highScore: 0,
                totalRoundsPlayed: 0
            };
        };

        var saveOrUpdateUser = function(aUser) {
            choreggAPI.User.query({username: aUser.username}, function(data) {
                if (data == null || data.length == 0 || data[0].username != aUser.username) {
                    choreggAPI.User.save(aUser.username, aUser);
                }  else {
                    aUser.createdDate = data[0].createdDate;
                    choreggAPI.User.update(aUser);
                }
            });
        };

        return {
            initialize: function() {
                user = null;
                $rootScope.$broadcast('userChanged', {user: user});
            },
            checkUpdateHighScore: function(aCurrentScore) {
                // Check and see if a new score is higher than the user's high score...if so - update it
                if(user) {
                    if (aCurrentScore > user.highScore) {
                        user.highScore = aCurrentScore;
                        choreggAPI.User.update({username: user.username}, user);
                    }
                }
            },
            getUser: function() {
                return user;
            },
            addRoundPlayed: function() {
                // Adds a round played to the current user
                if(user) {
                    user.totalRoundsPlayed += 1;
                    choreggAPI.User.update({username: user.username}, user);
                }
            },
            refreshUsers: function() {
                // Grabs the top few users out of the database.
                return refreshUsers();
            },
            setUser: function(aUsername) {
                // Create a user object with the right information
                user = createNewUser(aUsername);
                // Persist to local storage so we don't have to hit the API if we refresh
                $localStorage.user = user;
                // Create / Update the user's lastSignInDate
                saveOrUpdateUser(user);
                // Let the services / controllers know we've updated
                $rootScope.$broadcast('userChanged', {user: user});
            }
        }
    }]);