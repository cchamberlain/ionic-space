'use strict';

(function(module) {
  var standardDataCtrlFn = function ($scope, MongoMetadata, ChartConfiguration, ChartMetadata) { // standard-data
    $scope.configs = [];
    $scope.chart = new ChartMetadata();
    $scope.activeConfig = null;

    $scope.getInstances = function () {
      MongoMetadata.getInstances(function (instances) {
        $scope.chart.reset();
        $scope.chart.instances = instances;
      });
    };
    $scope.drillInstance = function (instanceName) {
      $scope.chart.reset({instanceName: false});
      $scope.chart.instanceName = instanceName;
      MongoMetadata.getInstance({instanceName: instanceName}, function (instanceMetadata) {
        $scope.chart.instanceMetadata = instanceMetadata;
      });
    };
    $scope.drillCollection = function (collectionName) {
      $scope.chart.reset({instanceName: false, instanceMetadata: false, collectionName: false});
      $scope.chart.collectionName = collectionName;
      MongoMetadata.getCollection({
        instanceName: $scope.chart.instanceName,
        collectionName: collectionName
      }, function (collectionMetadata) {
        $scope.chart.collectionMetadata = collectionMetadata;
        $scope.chart.extractSchema();
      });
    };

  }, standardDataFn = function () {
    return {
      restrict: 'E',
      scope: {
        instanceName: '@',
        instanceMetadata: '@',
        collectionName: '@',
        collectionMetadata: '@'
      },
      templateUrl: 'app/partials/standard-data.html',
      controller: standardDataCtrlFn,
      link: function (scope) {
        scope.getInstances();
      }
    }
  }, standardDataConfigCtrlFn = function ($scope) {
    $scope.preview = false;
    $scope.togglePreview = function () {
      $scope.preview = !$scope.preview;
    }
  }, standardDataConfigFn = function () {
    return {
      restrict: 'E',
      scope: {
        chart: '=',
        config: '=',
        preview: '@'
      },
      templateUrl: 'app/partials/standard-data-config.html',
      require: '^standardData',
      controller: standardDataConfigCtrlFn,
      link: function (scope, element, attrs, standardDataCtrl) {
      }
    };
  };

  standardDataConfigCtrlFn.$inject = ['$scope'];
  standardDataCtrlFn.$inject = ['$scope', 'MongoMetadata', 'ChartConfiguration', 'ChartMetadata'];
  module
    .directive('standardData', standardDataFn)
    .directive('standardDataConfig', standardDataConfigFn);
}(angular.module('standardData')));
