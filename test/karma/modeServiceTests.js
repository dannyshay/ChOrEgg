// Mode Service Tests
describe('Mode Service', function(){
    // Required variables for test
    var ModeService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_ModeService_) {
        ModeService = _ModeService_;
    }));

    it('exists', function() {
        expect(ModeService).toBeDefined();
    });

    it('can set a mode', function() {
        var aMode = "Endless";

        ModeService.setMode(aMode);
        expect(ModeService.getMode()).toBe(aMode);
    });
});