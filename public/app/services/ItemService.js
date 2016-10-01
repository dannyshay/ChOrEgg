//ItemService.js
//
// * Keeps track of the 'item' list in ChOrEgg
// * Responsibilities include:
// ** Keeping the item 'master list'
// ** Popping items off the stack
// ** Getting new items from the API

angular
    .module('choregg')
    .factory('ItemService', ['choreggAPI', '$q', 'TimerService', '$rootScope', 'CategoryService', function(choreggAPI, $q, TimerService, $rootScope, CategoryService) {
        var items = [];
        var currentItems = null;
        var gettingItems = false;

        return {
            getItems: function () {
                return items;
            },
            isGettingItems: function() {
                return gettingItems;
            },
            shiftItems: function () {
                return $q(function(resolve) {
                    //Pops the top item off the stack
                    items.shift();
                    currentItems = items[0];
                    $rootScope.$broadcast('itemsChanged', {items: items});
                    $rootScope.$broadcast('currentItemsChanged', {currentItems: currentItems});
                    TimerService.restartTimer();
                    resolve();
                });
            },
            getItemsInTimespan: function (aCategory, aTimespan, aNumPairs, aClearItems) {
                if(!gettingItems) {
                    gettingItems = true;
                    return $q(function (resolve) {
                        //Maybe we are changing a category / difficulty and want to clear the items
                        if (aClearItems == true) {
                            items = [];
                            currentItems = null;
                        }

                        var itemNames = [];
                        if (items.length > 0 && !aClearItems) {
                            itemNames = items[0].itemSet.map(function(i) { return i.name});
                        }

                        // Call the API to get some more items as specified by the input params
                        choreggAPI.GetItemsInTimespan.query({ category: aCategory, timeSpan: aTimespan, numPairs: aNumPairs, anOldItemSet: JSON.stringify(itemNames)},
                            function (data) {
                                if (CategoryService.getCurrentCategory() != aCategory) { resolve(); }
                                //Add the items to the array since we didn't necessarily clear it
                                data.forEach(function(item) {
                                    items.push(item);
                                });
                                $rootScope.$broadcast('itemsChanged', {items: items});

                                if (!currentItems) {
                                    currentItems = items[0];
                                    $rootScope.$broadcast('currentItemsChanged', {currentItems: currentItems});
                                }
                                gettingItems = false;
                                //Return the promise
                                resolve({currentItems: currentItems});
                            }
                        );
                    });

                } else {
                    return false;
                }
            }
        }
    }]);