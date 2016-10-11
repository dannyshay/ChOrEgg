angular
    .module('choregg')
    .factory('AudioService', ['$rootScope', 'ngAudio', function($rootScope, ngAudio) {
        var isPlaying = false;
        var mainMusic = $('#mainMusic').get(0);

        return {
            getIsPlaying: function() {
                // THIS IS ONLY USED FOR TEST
                return isPlaying;
            },
            startPlaying: function() {
                if (!isPlaying) {
                    isPlaying = true;
                    $rootScope.$broadcast('isPlayingChanged', {isPlaying: isPlaying});

                    mainMusic.play({loop:true});
                }
            },
            pausePlaying: function() {
                if (isPlaying) {
                    isPlaying = false;
                    $rootScope.$broadcast('isPlayingChanged', {isPlaying: isPlaying});

                    mainMusic.pause();
                }
            }
        }
    }]);