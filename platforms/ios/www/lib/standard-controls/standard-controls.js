(function() {
    "use strict";
    angular.module('standardControls', ['standardAnimation'])
        .filter('commas', function () { // commas filter
            return function (list) {
                return list.join(', ');
            }
        })
        .filter('point', ['$filter', function ($filter) {
            return function (point) {
                var numberFilter = $filter('number');
                return sprintf("x: %1s, y: %2s", numberFilter(point.x, 1), numberFilter(point.y, 1));
            }
        }])
        .filter('attributeMapping', function () {
            return function (attributeMapping) {
                return sprintf("=> %1s", attributeMapping.selectedType);
            }
        })
        .directive('standardSelect', function () { // standard-select directive
            return {
                restrict: 'A',
                scope: {
                    sId: '@',
                    sPlaceholder: '@',
                    sGetItems: '&',
                    sSelectedItem: '='
                },
                templateUrl: 'templates/standard-select.html',
                controller: ['$scope', function ($scope) { // standard-select controller
                    $scope.selectItem = function (item) {
                        $scope.sSelectedItem = item;
                    }
                }]
            }
        })
        .directive('standardDots', function () { // standard-dots directive
            return {
                restrict: 'E',
                scope: {
                    sCount: '@',
                    sHeight: '@'
                },
                templateUrl: 'templates/standard-dots.html',
                link: function (scope, element) {
                    scope.init(element[0]);
                },
                controller: ['$scope', '$window', 'd3', function ($scope, $window, d3) { // standard-dots controller
                    $scope.init = function (element) {
                        var $svg = d3.select(element).select('svg');
                        $scope.parent = $window.jQuery(element.parentNode);
                        $scope.svg = $svg.node();
                        $scope.$svg = $window.jQuery($scope.svg);
                        $scope.setCalculated();
                    }
                    $scope.setCalculated = function () {
                        $scope.sIndividualWidth = $scope.parent.width() / parseInt($scope.sCount);
                    }
                    $scope.getRange = function () {
                        return new Array(parseInt($scope.sCount));
                    }
                }]
            };
        })
        .directive('standardDot', function () { // standard-dot directive
            return {
                restrict: 'A',
                scope: {
                    sRadiusSmall: '@',
                    sRadiusLarge: '@',
                    sGetX: '&'
                },
                link: function (scope, element, attrs) {
                    var svg = d3.select(element[0].parentNode);
                    svg.attr('width', 20);
                    d3.select(element[0])
                        .attr('cx', 0)
                        .attr('cy', 20)
                        .attr('r', 20);
                },
                controller: ['$scope', 'd3', function ($scope, d3) { // standard-dot controller
                    $scope.getRadius = function () {
                        return $scope.sRadiusSmall;
                    }
                }]
            }
        });
}).call(this);

//# sourceMappingURL=standard-controls.js.map