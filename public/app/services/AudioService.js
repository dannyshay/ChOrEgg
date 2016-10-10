angular
    .module('choregg')
    .factory('AudioService', ['$rootScope', 'ngAudio', function($rootScope, ngAudio) {
        // Default this to true since we have AutoPlay enabled on the HTML5 control
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        var isPlaying = !iOS;
        var mainMusic = $('#mainMusic').get(0);

        var showHidePlayer = function() {
            if (document.hidden) {
                mainMusic.pause()
            } else {
                try {
                    if (isPlaying) { mainMusic.play(); }
                } catch (ex) {
                    console.log("Error (likely in test) - " + ex);
                }

            }
        };

        $(document).on('visibilitychange', showHidePlayer(), false);

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