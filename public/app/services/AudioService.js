angular
    .module('choregg')
    .factory('AudioService', ['$rootScope', 'ngAudio', function($rootScope, ngAudio) {
        // Default this to true since we have AutoPlay enabled on the HTML5 control
        var isPlaying = true;
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
            stopPlaying: function() {
                if (isPlaying) {
                    isPlaying = false;
                    $rootScope.$broadcast('isPlayingChanged', {isPlaying: isPlaying});

                    mainMusic.restart();
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