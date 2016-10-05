// Timer Service Tests
describe('Timer Service', function(){
    // Required variables for test
    var TimerService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_TimerService_) {
        TimerService = _TimerService_;
    }));

    it('exists', function() {
       expect(TimerService).toBeDefined();
    });

    it('should restart', function() {
        TimerService.restartTimer();
        expect(TimerService.getTimeRemaining()).toBe(10);
        expect(TimerService.getIsRunning()).toBe(true);
        expect(TimerService.getIsPaused()).toBe(false);
    });

    it('should tickdown', function() {
        TimerService.restartTimer();
        var currentTimeRemaining = TimerService.getTimeRemaining();

        TimerService.tickDown();
        expect(TimerService.getTimeRemaining()).toBe(currentTimeRemaining - 1);
    });

    it('should pause', function() {
        TimerService.restartTimer();
        TimerService.pause();
        expect(TimerService.getIsPaused()).toBe(true);
        expect(TimerService.getIsRunning()).toBe(false);
    });

    it('should resume', function() {
        TimerService.restartTimer();
        TimerService.pause();
        expect(TimerService.getIsPaused()).toBe(true);
        expect(TimerService.getIsRunning()).toBe(false);

        TimerService.resume();
        expect(TimerService.getIsPaused()).toBe(false);
        expect(TimerService.getIsRunning()).toBe(true);
    });

    it('should start', function() {
        TimerService.restartTimer();
        TimerService.stopTimer();
        TimerService.startTimer();
        expect(TimerService.getIsPaused()).toBe(false);
        expect(TimerService.getIsRunning()).toBe(true);
    });

    it('should stop', function() {
        TimerService.restartTimer();
        TimerService.startTimer();
        TimerService.stopTimer();
        expect(TimerService.getIsPaused()).toBe(false);
        expect(TimerService.getIsRunning()).toBe(false);
    });
});