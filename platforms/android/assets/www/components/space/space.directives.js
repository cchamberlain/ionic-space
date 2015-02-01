'use strict';

(function (module) {

    var templatesDir = 'www/components/space/templates/',
        sBoxCtrlFn = function ($scope, d3) {

        }, sBoxFn = function () {
            return {
                restrict: 'A',
                templateUrl: templatesDir + 's-box.html',
                controller: sBoxCtrlFn
            };
        }, sWorkshopCtrlFn = function ($scope, d3) {

        }, sWorkshopFn = function () {
            return {
                restrict: 'A',
                templateUrl: templatesDir + 's-workshop.html',
                controller: sWorkshopCtrlFn
            };
        }, sUniverseCtrlFn = function ($scope, d3) {
        }, sUniverseFn = function () {
            return {
                restrict: 'A',
                templateUrl: templatesDir + 's-universe.html',
                controller: sUniverseCtrlFn
            }
        }, sShipCtrlFn = function ($scope, d3) {
        }, sShipFn = function () {
            return {
                restrict: 'A',
                scope: {},
                templateUrl: templatesDir + 's-ship.html',
                controller: sShipCtrlFn
            }
        }, sPartCtrlFn = function ($scope, d3) {
        }, sPartFn = function () {
            return {
                restrict: 'A',
                scope: {
                    sNodes: '='
                },
                templateUrl: templatesDir + 's-part.html',
                controller: sPartCtrlFn
            }
        };

    sBoxCtrlFn.$inject = ['$scope', 'd3'];
    sWorkshopCtrlFn.$inject = ['$scope', 'd3'];
    sUniverseCtrlFn.$inject = ['$scope', 'd3'];
    sShipCtrlFn.$inject = ['$scope', 'd3'];
    sPartCtrlFn.$inject = ['$scope', 'd3'];

    module
        .directive('sBox', sBoxFn)
        .directive('sWorkshop', sWorkshopFn)
        .directive('sUniverse', sUniverseFn)
        .directive('sShip', sShipFn)
        .directive('sPart', sPartFn);
}(angular.module('space')));
