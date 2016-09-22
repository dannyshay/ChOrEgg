// Category Service Tests
describe('Category Service', function(){
    var CategoryService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(inject(function(_CategoryService_) {
        CategoryService = _CategoryService_;
        CategoryService.loadCategories();
    }));

    it('exists', function() {
       expect(CategoryService).toBeDefined();
    });

    it('loaded the categories correctly and "got" them properly', function() {
        var categories = CategoryService.getCategories();
        expect(categories).not.toBeNull();
        expect(categories).not.toBe(undefined);
        expect(categories.length).toBeGreaterThan(0);
    });

    it('set the current category correctly', function() {
       var currentCategory = CategoryService.getCurrentCategory();
        expect(currentCategory).not.toBeNull();
        expect(currentCategory.categoryName.length).toBeGreaterThan(0);
    });

    it('can set the current category', function() {
        CategoryService.setCurrentCategory('TestCategory');
        expect(CategoryService.getCurrentCategory()).toBe('TestCategory');
    });

    it('initializes properly', function() {
        CategoryService.initialize();
        expect(CategoryService.getCategories().length).toBe(0);
        expect(CategoryService.getCurrentCategory()).toBe(null);
    });
});