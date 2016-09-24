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
});