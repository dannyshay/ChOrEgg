// Authentication Service Tests
describe('Authentication Service', function(){
    // Required variables for test
    var AuthenticationService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_AuthenticationService_) {
        AuthenticationService = _AuthenticationService_;
    }));

    it('exists', function() {
        expect(AuthenticationService).toBeDefined();
    });

    it('can sign in a user', function() {
        inject(function($localStorage) {
            var myUser = { w3: { U3: "danny624@gmail.com" } }
            AuthenticationService.signIn(myUser);
            expect(AuthenticationService.getSignedIn()).toBe(true);
            expect($localStorage.signedIn).toBe(true);
        });
    });

    it('can sign out a user', function() {
        inject(function($localStorage) {
            AuthenticationService.signOut();
            expect(AuthenticationService.getSignedIn()).toBe(false);
            expect($localStorage.signedIn).toBe(false);
            expect($localStorage.user).toBe(null);
        });
    });
});