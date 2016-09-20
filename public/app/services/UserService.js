angular
    .module('choregg')
    .factory('UserService', ['$localStorage', 'choreggAPI','$q', function($localStorage, choreggAPI, $q) {
        var user = null;
        var username = null;
        var users = null;

        if ($localStorage.user)
            user = $localStorage.user;

        if ($localStorage.username)
            username = $localStorage.username;

        if ($localStorage.users)
            users = $localStorage.users;

        var updateUsers = function() {
            return $q(function(resolve) {
                choreggAPI.GetUsersByHighScore.query({numUsers: 20}, function(data) {
                    if(data != null && data.users != null && data.users != users) {
                        users = data.users;
                        $localStorage.users = users;
                    }
                    resolve(users);
                });
            });
        };

        updateUsers();

        return {
            getUser: function() {
                return user;
            },
            getUsername: function() {
                return username;
            },
            initialize: function() {
                user = null;
                username = null;
            },
            checkUpdateHighScore: function(aCurrentScore) {
                return $q(function(resolve) {
                    if(user) {
                        if (aCurrentScore > user.highScore) {
                            user.highScore = aCurrentScore;
                            choreggAPI.User.update({username: username}, user);
                            console.log('New high score!');
                        }

                        resolve(user.highScore);
                    }
                });
            },
            addRoundPlayed: function() {
                return $q(function(resolve) {
                    if(user) {
                        user.totalRoundsPlayed += 1;
                        choreggAPI.User.update({username: username}, user);
                        resolve(user);
                    }
                });
            },
            getCurrentUser: function() {
                return user;
            },
            getUsers: function() {
                return users;
            },
            updateUsers: function() {
                return updateUsers();
            },
            signInUser: function(aUsername) {
                return $q(function(resolve) {
                    var today = new Date();
                    var myFormattedTodayDate = (("00" + (today.getMonth() + 1)).slice(-2)) + '/' + (("00" + (today.getDate())).slice(-2)) + '/' + today.getFullYear();

                    choreggAPI.User.query({username: aUsername}, function(data) {
                       if (data == null || data == null || data.length == 0 || data[0].username != aUsername) {
                           var myUser = {
                               username: aUsername,
                               createdDate: myFormattedTodayDate,
                               lastSignInDate: myFormattedTodayDate,
                               highScore: 0,
                               totalRoundsPlayed: 0
                           };

                           user = myUser;
                           username = myUser.username;

                           $localStorage.user = user;
                           $localStorage.username = username;

                           choreggAPI.User.save(aUsername, myUser);
                           resolve(myUser);
                       }  else {
                           var myFoundUser = data[0];

                           var myUser = {
                               username: aUsername,
                               createdDate: myFoundUser.createdDate,
                               lastSignInDate: myFormattedTodayDate,
                               highScore: myFoundUser.highScore,
                               totalRoundsPlayed: myFoundUser.totalRoundsPlayed
                           };

                           user = myUser;
                           username = myUser.username;

                           $localStorage.user = user;
                           $localStorage.username = username;

                           choreggAPI.User.update(myUser);
                           resolve(myUser);
                       }
                    });
                });
            }
        }
    }]);