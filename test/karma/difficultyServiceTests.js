// Category Service Tests
describe('Difficulty Service', function(){
    var CategoryService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_DifficultyService_) {
        DifficultyService = _DifficultyService_;
    }));

    it('exists', function() {
       expect(DifficultyService).toBeDefined();
    });

    it('can get/set the current category', function() {
        var testDifficulty = {difficultyName: "Easy", timeSpan: 50}
        DifficultyService.setCurrentDifficulty(testDifficulty);
        expect(DifficultyService.getCurrentDifficulty()).toBe(testDifficulty);
    });
});