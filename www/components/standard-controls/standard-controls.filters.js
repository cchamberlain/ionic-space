'use strict';

(function (module) {
  var commasFn = function () { // commas filter
    return function(list) {
      return list.join(', ');
    }
  }, pointFn = function ($filter) {
    return function(point) {
      var numberFilter = $filter('number');
      return sprintf("x: %1s, y: %2s", numberFilter(point.x, 1), numberFilter(point.y, 1));
    }
  }, attributeMappingFn = function () {
    return function(attributeMapping) {
      return sprintf("=> %1s", attributeMapping.selectedType);
    }
  };

  pointFn.$inject = ['$filter'];
  module
    .filter('commas', commasFn)
    .filter('point', pointFn)
    .filter('attributeMapping', attributeMappingFn);
}(angular.module('standardControls')));
