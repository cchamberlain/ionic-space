(function() {
    "use strict";
    angular.module('standardAnimation', ['ngAnimate', 'standardControls'])
        .factory('d3', ['$window', function ($window) {
            return $window.d3;
        }])
        .directive('standardFade', function () {
            return {
                restrict: 'A',
                scope: {
                    //sContainerSelector: '@',
                    sChain: '&'
                },
                controller: ['$scope', '$window', '$animate', 'd3', function ($scope, $window, $animate, d3) {
                    $scope.start = function () {
                        $scope.sChain();
                    }
                }],
                link: function (scope, element) {
                    element.bind('click', function () {
                        scope.$apply(function () {
                            scope.start();
                        });
                    });
                }
            };
        });
}).call(this);

//# sourceMappingURL=standard-animation.js.map