//GameService.js
//
// * Keeps track of the 'item' list in ChOrEgg
// * Responsibilities include:
// ** Keeping the item 'master list'
// ** Popping items off the stack
// ** Getting new items from the API

angular
    .module('choregg')
    .factory('GameService', ['choreggAPI', '$q', 'TimerService', function(choreggAPI, $q, TimerService) {
        var items = [];
        var currentItems = null;

        return {
            getItems: function () {
                return items;
            },
            getCurrentItems: function() {
              return currentItems;
            },
            shiftItems: function () {
                return $q(function(resolve) {
                    //Pops the top item off the stack
                    items.shift();
                    currentItems = items[0];
                    TimerService.restartTimer();
                    resolve();
                });
            },
            getItemsInTimespan: function (aCategory, aTimespan, aNumPairs, aClearItems) {
                return $q(function (resolve) {
                    //Maybe we are changing a category / difficulty and want to clear the items
                    if (aClearItems == true) {
                        items = [];
                        currentItems = null;
                    }

                    if (aCategory != 'random') {
                        // Call the API to get some more items as specified by the input params
                        choreggAPI.GetItemsInTimespan.query({ category: aCategory, timeSpan: aTimespan, numPairs: aNumPairs},
                            function (data) {
                                //Add the items to the array since we didn't necessarily clear it
                                data.forEach(function(item) {
                                    items.push(item);
                                });

                                if (!currentItems)
                                    currentItems = items[0];

                                //Return the promise
                                resolve();
                            }
                        );
                    } else {

                    }
                });
            }
        }
    }]);