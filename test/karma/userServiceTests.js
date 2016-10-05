// User Service Tests
describe('User Service', function(){
    // Required variables for test
    var UserService;
    var aUsername = 'mrTestUser@domain.com';

    // Grab today's date so we can verify against the sign in date
    var today = new Date();
    var myFormattedTodayDate = (("00" + (today.getMonth() + 1)).slice(-2)) + '/' + (("00" + (today.getDate())).slice(-2)) + '/' + today.getFullYear();

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_UserService_) {
        UserService = _UserService_;
        UserService.setUser(aUsername);
    }));

    it('exists', function() {
       expect(UserService).toBeDefined();
    });

    it('should set a user', function() {
        inject(function($localStorage, $rootScope) {
            var currentUser = UserService.getUser();

            // Make sure we got a user
            expect(currentUser).toBeDefined();

            // Make sure it has the right username
            expect(currentUser.username).toBe(aUsername);

            // Make sure the last sign in date is today's date
            expect(currentUser.lastSignInDate).toBe(myFormattedTodayDate);

            // Make sure we updated local storage properly
            expect($localStorage.user).toBe(currentUser);

            $rootScope.$on('')
        });
    });

    it('should get a user', function() {
        expect(UserService.getUser()).toBeDefined();
    });

    it('should add a round played', function()  {
        var oldRoundsPlayed = UserService.getUser().totalRoundsPlayed;
        UserService.addRoundPlayed();
        expect(UserService.getUser().totalRoundsPlayed).toBe(oldRoundsPlayed + 1);
    });

    it('should check/update high score with a high score and update', function() {
        var currentHighScore = UserService.getUser().highScore;
        UserService.checkUpdateHighScore(currentHighScore + 10);
        expect(UserService.getUser().highScore).toBe(currentHighScore + 10);
    });

    it('should check/update high score with a low score and not update', function() {
        var currentHighScore = UserService.getUser().highScore;
        UserService.checkUpdateHighScore(currentHighScore - 5);
        expect(UserService.getUser().highScore).toBe(currentHighScore);
    });

    it('should initialize', function() {
        UserService.initialize();
        expect(UserService.getUser()).toBeNull();
    });
});