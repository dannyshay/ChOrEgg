angular
    .module('choregg')
    .factory('DifficultyService', ['$cookies','choreggAPI', '$q', function($cookies, choreggAPI, $q) {
        var difficulties = [];
        var currentDifficulty = '';

        return {
            getDifficulties: function () {
                return difficulties;
            },
            initialize: function() {
                difficulties = [];
            },
            getCurrentDifficulty: function() {
              return currentDifficulty;
            },
            setCurrentDifficulty: function(aDifficulty) {
              currentDifficulty = aDifficulty;
            },
            loadDifficulties: function () {
                return $q(function (resolve) {
                    // Try and load the difficulties from cookies
                    var myDifficulties = $cookies.get('difficulties');
                    if (!myDifficulties || myDifficulties == undefined) {
                        // If we can't find anything - grab them from the API
                        choreggAPI.Difficulties.get(function (data) {
                            myDifficulties = data.Difficulties;
                            // Save the results to a cookie
                            $cookies.put('difficulties', JSON.stringify(myDifficulties));

                            difficulties = myDifficulties;
                            currentDifficulty = difficulties[0];
                            resolve(difficulties);
                        });
                    } else {
                        // Parse the difficulties from the cookie
                        myDifficulties = JSON.parse(myDifficulties);

                        difficulties = myDifficulties;
                        currentDifficulty = difficulties[0];
                        resolve(difficulties);
                    }

                })
            }
        }
    }]);