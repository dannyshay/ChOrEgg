// Category Service Tests
describe('Category Service', function(){
    var CategoryService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_CategoryService_) {
        CategoryService = _CategoryService_;
    }));

    it('exists', function() {
       expect(CategoryService).toBeDefined();
    });
});