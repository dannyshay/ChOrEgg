// HUD Service Tests
describe('HUD Service', function(){
    // Required variables for test
    var HUDService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_HUDService_) {
        HUDService = _HUDService_;
    }));

    it('exists', function() {
       expect(HUDService).toBeDefined();
    });

    it('should initialize', function() {
        HUDService.initialize();
        expect(HUDService.getCurrentScore()).toBe(0);
        expect(HUDService.getNumStrikes()).toBe(0);
    });

    it('should add strikes', function() {
        HUDService.initialize();
        var currentNumStrikes = HUDService.getNumStrikes();
        HUDService.addStrike();
        expect(HUDService.getNumStrikes()).toBe(currentNumStrikes + 1);
    });

    it('should reset numStrikes', function() {
        HUDService.initialize();
        var currentNumStrikes = HUDService.getNumStrikes();
        HUDService.addStrike(5);
        HUDService.resetNumStrikes();
        expect(HUDService.getNumStrikes()).toBe(0);
    });

    it('should add points', function() {
        var pointsToAdd = 5;

        HUDService.initialize();

        var currentScore = HUDService.getCurrentScore();

        HUDService.addPoints(pointsToAdd);
        expect(HUDService.getCurrentScore()).toBe(currentScore + pointsToAdd);
    });

    it('should reset points', function() {
        HUDService.initialize();

        HUDService.addPoints(5);
        HUDService.resetCurrentScore();
        expect(HUDService.getNumStrikes()).toBe(0);
    });
});