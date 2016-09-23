// Category Service Tests
describe('Category Service', function(){
    var CategoryService;

    beforeEach(angular.mock.module('choregg'));

    beforeEach(function(done) {
        inject(function($httpBackend, $rootScope){
            inject(function(_CategoryService_) {
                CategoryService = _CategoryService_;
                CategoryService.loadCategories().then(function() {
                    done();
                });

                $httpBackend.when('GET','/api/categories').respond([{"categoryName":"People"},{"categoryName":"Inventions"},{"categoryName":"Monuments"}])
                $httpBackend.when('GET','views/main.html').respond(200);

                $rootScope.$apply();
            });
        });
    });

    it('exists', function() {
       expect(CategoryService).toBeDefined();
    });
    //
    // it('loaded the categories correctly and "got" them properly', inject(function($httpBackend, $rootScope) {
    //
    //
    //     var categories = CategoryService.getCategories();
    //     expect(categories).not.toBeNull();
    //     expect(categories).not.toBe(undefined);
    //     expect(categories.length).toBeGreaterThan(0);
    // }));
    //
    // it('can set the current category', inject(function() {
    //     CategoryService.setCurrentCategory('TestCategory');
    //     expect(CategoryService.getCurrentCategory()).toBe('TestCategory');
    // }));
    //
    // it('initializes properly', inject(function() {
    //     CategoryService.initialize();
    //     expect(CategoryService.getCategories().length).toBe(0);
    //     expect(CategoryService.getCurrentCategory()).toBe(null);
    // }));
});