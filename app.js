(function() {
  'use strict';
  angular
    .module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var controller = this;

    controller.searchTerm = "";

    controller.searchFor = function() {
      // at execution, check if textbox is empty
      if (controller.searchTerm === "") {
        controller.items = [];
        return;
      } else {
        var promise = MenuSearchService.getMatchedMenuItems(controller.searchTerm);
        promise.then(function(response) {
          controller.items = response;
          console.log("blah");
        })
        .catch(function(error) {
          console.log("Something went wrong", error);
        });
      }
      
    };

    controller.removeItem = function(index) {
      controller.items.splice(index, 1);
    };
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
        return $http({
          method: 'GET',
          url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
        }).then(function (result) {
        // process result and only keep items that match
        var items = result.data.menu_items;

        var foundItems = [];

        for (var i = 0; i < items.length; i++) {
          if (items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            foundItems.push(items[i]);
          }
        }

        // return processed items
        return foundItems;
      });
    };
  }

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: FoundItemListDirectiveController,
      controllerAs: 'list',
      bindToController: true
    };
    return ddo;
  }

  function FoundItemListDirectiveController() {
    var list = this;

    // check if the returned array is empty to show "nothing found"
    list.isEmpty = function() {
      if(list.found != undefined && list.found.length === 0) {
        return true;
      }
      
    }
  }

})();