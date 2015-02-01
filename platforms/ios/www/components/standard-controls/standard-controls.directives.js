'use strict';

(function (module) {
  var standardSelectCtrlFn = function ($scope) { // standard-select controller
    $scope.selectItem = function (item) {
      $scope.sSelectedItem = item;
    }
  }, standardSelectFn = function () { // standard-select directive
    return {
      restrict: 'A',
      scope: {
        sId: '@',
        sPlaceholder: '@',
        sGetItems: '&',
        sSelectedItem: '='
      },
      templateUrl: 'app/partials/standard-select.html',
      controller: standardSelectCtrlFn
    }
  }, standardDotsCtrlFn = function ($scope, $window, d3) { // standard-dots controller
    $scope.init = function(element) {
      var $svg = d3.select(element).select('svg');
      $scope.parent = $window.jQuery(element.parentNode);
      $scope.svg = $svg.node();
      $scope.$svg = $window.jQuery($scope.svg);
      $scope.setCalculated();
    }
    $scope.setCalculated = function() {
      $scope.sIndividualWidth = $scope.parent.width() / parseInt($scope.sCount);
    }
    $scope.getRange = function() {
      return new Array(parseInt($scope.sCount));
    }
  }, standardDotsFn = function () { // standard-dots directive
    return {
      restrict: 'E',
      scope: {
        sCount: '@',
        sHeight: '@'
      },
      templateUrl: 'app/partials/standard-dots.html',
      controller: standardDotsCtrlFn,
      link: function (scope, element) {
        scope.init(element[0]);
      }
    };
  }, standardDotCtrlFn = function($scope, d3) { // standard-dot controller
    $scope.getRadius = function() {
      return $scope.sRadiusSmall;
    }
  }, standardDotFn = function() { // standard-dot directive
    return {
      restrict: 'A',
      scope: {
        sRadiusSmall: '@',
        sRadiusLarge: '@',
        sGetX: '&'
      },
      controller: standardDotCtrlFn,
      link: function (scope, element, attrs) {

        var svg = d3.select(element[0].parentNode);
        svg.attr('width', 20);
        var circles = d3.select(element[0])
          .attr('cx', 0)//scope.sGetX(1))
          .attr('cy', 20)
          .attr('r', 20);
        /*element.setAttribute('cx', 20);
        element.setAttribute('cy', 20);
        element.setAttribute('r', 20);*/
     }
    };
  };

  standardSelectCtrlFn.$inject = ['$scope'];
  standardDotsCtrlFn.$inject = ['$scope', '$window', 'd3'];
  standardDotCtrlFn.$inject = ['$scope', 'd3'];

  module
    .directive('standardSelect', standardSelectFn)
    .directive('standardDots', standardDotsFn)
    .directive('standardDot', standardDotFn);
}(angular.module('standardControls')));
