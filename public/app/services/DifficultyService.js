angular
    .module('choregg')
    .factory('DifficultyService', ['$cookies','choreggAPI', '$q', '$rootScope', function($cookies, choreggAPI, $q, $rootScope) {
        var difficulties = [];
        var currentDifficulty = null;

        return {
            getCurrentDifficulty: function() {
              return currentDifficulty;
            },
            setCurrentDifficulty: function(aDifficulty) {
              currentDifficulty = aDifficulty;
                $rootScope.$broadcast('currentDifficultyChanged', {currentDifficulty: currentDifficulty});
            },
            loadDifficulties: function () {
                return $q(function (resolve) {
                    // Try and load the difficulties from cookies
                    var myDifficulties = $cookies.get('difficulties');
                    if (!myDifficulties || myDifficulties == undefined) {
                        // If we can't find anything - grab them from the API
                        choreggAPI.Difficulties.query(function (data) {
                            myDifficulties = data;
                            // Save the results to a cookie
                            $cookies.put('difficulties', JSON.stringify(myDifficulties));

                            difficulties = myDifficulties;
                            currentDifficulty = difficulties[0];
                            $rootScope.$broadcast('currentDifficultyChanged', {currentDifficulty: currentDifficulty});
                            $rootScope.$broadcast('difficultiesLoaded', {difficulties: difficulties});
                            resolve(difficulties);
                        });
                    } else {
                        // Parse the difficulties from the cookie
                        myDifficulties = JSON.parse(myDifficulties);

                        difficulties = myDifficulties;
                        currentDifficulty = difficulties[0];
                        $rootScope.$broadcast('currentDifficultyChanged', {currentDifficulty: currentDifficulty});
                        $rootScope.$broadcast('difficultiesLoaded', {difficulties: difficulties});
                        resolve(difficulties);
                    }

                })
            }
        }
    }]);