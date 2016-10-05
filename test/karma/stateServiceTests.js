// State Service Tests
describe('State Service', function(){
    // Required variables for test
    var StateService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_StateService_) {
        StateService = _StateService_;
    }));

    it('exists', function() {
        expect(StateService).toBeDefined();
        //This is defaulted
        expect(StateService.getCurrentState()).toBe('splash');
    });

    it('can set a state', function() {
        var aState = "game";

        StateService.setCurrentState(aState);
    });
});