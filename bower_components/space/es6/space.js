angular.module('space', ['standardMetrics'])
    .directive('sBox', function () {
        return {
            restrict: 'A',
            scope: {
            },
            templateUrl: 'templates/s-box.html',
            controller: ['$scope', 'd3', function ($scope, d3) {
            }]
        };
    })
    .directive('sWorkshop', function () {
        return {
            restrict: 'A',
            scope: {
            },
            templateUrl: 'templates/s-workshop.html',
            controller: ['$scope', 'd3', function ($scope, d3) {
            }]
        };
    })
    .directive('sUniverse', function () {
        return {
            restrict: 'A',
            scope: {
            },
            templateUrl: 'templates/s-universe.html',
            controller: ['$scope', 'd3', function ($scope, d3) {
            }]
        };
    })
    .directive('sShip', function () {
        return {
            restrict: 'A',
            scope: {
            },
            templateUrl: 'templates/s-ship.html',
            controller: ['$scope', 'd3', function ($scope, d3) {
            }]
        };
    })
    .directive('sPart', function () {
        return {
            restrict: 'A',
            scope: {
            },
            templateUrl: 'templates/s-part.html',
            controller: ['$scope', 'd3', function ($scope, d3) {
            }]
        };
    })