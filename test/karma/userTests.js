// User Service Tests
describe('User Service', function(){
    var UserService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_UserService_) {
        UserService = _UserService_;
    }));

    it('exists', function() {
       expect(UserService);
    });
});