// Loading Service Tests
describe('Loading Service', function(){
    // Required variables for test
    var LoadingService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_LoadingService_) {
        LoadingService = _LoadingService_;
    }));

    it('exists', function() {
        expect(LoadingService).toBeDefined();
    });

    it('can set a loading flag', function() {
        var aLoading = false;

        LoadingService.setLoading(aLoading);
        expect(LoadingService.getLoading()).toBe(aLoading);

        LoadingService.setLoading(!aLoading);
        expect(LoadingService.getLoading()).toBe(!aLoading);
    });
});