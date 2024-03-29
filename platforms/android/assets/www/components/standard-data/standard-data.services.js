'use strict';

(function (module) {
  var mongoMetadataFn = function ($resource) {
    return $resource("api/mongo-metadata/:instanceName/:collectionName", {
        instanceName: '@instanceName',
        collectionName: '@collectionName'
      },
      {
        'getInstances': {method: 'GET', isArray: true},
        'getInstance': {method: 'GET'},
        'getCollection': {method: 'GET'}
      }
    );
  }, chartConfigurationFn = function () {
    var chartSpecifications = {
      'scatter': {
        dynamicAttributes: ['x', 'y'],
        fixedAttributes: false,
        fixedRangeAttributes: [{name: 'x'}],
        equation: false
      },
      'line': {
        dynamicAttributes: false,
        fixedAttributes: ['m', 'b'],
        fixedRangeAttributes: [{name: 'x'}],
        equation: function (m, b, x) {
          return m * x + b;
        }
      },
      'bar': {
        dynamicAttributes: ['x', 'y'],
        fixedAttributes: false,
        fixedRangeAttributes: [{name: 'x'}],
        equation: false
      },
      'pie': {},
      'funnel': {},
      'area': {},
      'ohlc': {},
      'candlestick': {}
    }

    function ChartConfiguration(instanceName, collectionName) {
      this.instanceName = instanceName;
      this.collectionName = collectionName;
      this.chartName = this.generateChartName();
      this.chartType = 'scatter';
      this.attributes = { x: null, y: null }; //TODO: MAKE THIS SHIT MORE DYNAMIC (pull from chartspecification
      this.attributeMappings = null;
      this.staticData = null;
      this.flags = {
        supportsMultiple: false
      }
    }

    ChartConfiguration.prototype.generateChartName = function () {
      return Math.random().toString(36).substr(2, 5);
    }
    ChartConfiguration.prototype.getChartTypes = function () {
      return Object.keys(chartSpecifications);
    }
    ChartConfiguration.prototype.getChartSpecifications = function (chartType) {
      return chartSpecifications[chartType];
    }
    ChartConfiguration.prototype.addAttribute = function (name, metadata) {
      if (!this.attributeMappings) {
        this.attributeMappings = {};
      }
      this.attributeMappings[name] = metadata;
      for(var attributeName in this.attributes) {
        if(!this.attributes[attributeName]) {
          this.attributes[attributeName] = name;
          return;
        }
      }
    }
    return ChartConfiguration;
  }, chartMetadataFn = function (ChartConfiguration) {
    var _chart = null,
      processSchemaElement = function (element) {
        for (var property in element) {
          var exists = _chart.schema[property],
            schemaElement = exists ? angular.copy(_chart.schema[property]) : {values: [], types: []},
            value = element[property],
            type = _chart.getSelectedType(value);
          schemaElement.values.push(value);
          if (schemaElement.types.indexOf(type) == -1) {
            schemaElement.types.push(type);
          }
          _chart.schema[property] = schemaElement;
        }
      }

    function ChartMetadata() {
      this.instances = null;
      this.instanceName = null;
      this.instanceMetadata = null;
      this.collectionName = null;
      this.collectionMetadata = null;
      this.schema = null;
      this.activeConfig = null;
      this.configs = [];
        _chart = this;
    }
    ChartMetadata.prototype.getAvailableTypes = function () {
      return ['string', 'datetime', 'integer', 'double', 'decimal'];
    }
    ChartMetadata.prototype.addConfig = function () {
      var config = this.createConfig();
      this.configs.push(config);
      this.setActiveConfig(config);
    }
    ChartMetadata.prototype.createConfig = function () {
      return new ChartConfiguration(this.instanceName, this.collectionName);
    }
    ChartMetadata.prototype.deleteConfig = function (config) {
      var keyToDelete = -1;
      this.configs.some(function (currentConfig, i) {
        if (currentConfig === config) {
          keyToDelete = i;
          return true;
        }
        return false;
      });
      if (keyToDelete != -1) {
        this.configs.splice(keyToDelete, 1);
      }
    }
    ChartMetadata.prototype.isActiveConfig = function (config) {
      return this.activeConfig === config;
    }
    ChartMetadata.prototype.setActiveConfig = function (config) {
      this.activeConfig = config;
    }
    ChartMetadata.prototype.getSelectedType = function (value) {
      var typeName = typeof value,
        availableTypes = this.getAvailableTypes();
      switch (typeName) {
        case 'number':
          if (value % 1 === 0) {
            return availableTypes[1];
          }
          return availableTypes[2];
        case 'string':
        default:
          return availableTypes[0];
      }
    }
    ChartMetadata.prototype.reset = function (options) {
      options = angular.extend({}, {
        instanceName: true,
        instanceMetadata: true,
        collectionName: true,
        collectionMetadata: true,
        schema: true
      }, options);
      for (var prop in options) {
        if (options.hasOwnProperty(prop) && options[prop] && this.hasOwnProperty(prop)) {
          this[prop] = null;
        }
      }
    }
    ChartMetadata.prototype.extractSchema = function () {
      this.reset({
        instanceName: false,
        instanceMetadata: false,
        collectionName: false,
        collectionMetadata: false,
        schema: false
      });
      this.schema = {};
      this.collectionMetadata.sample.forEach(processSchemaElement);
    }
    return ChartMetadata;
  };

  mongoMetadataFn.$inject = ['$resource'];
  chartMetadataFn.$inject = ['ChartConfiguration'];

  module
    .factory('MongoMetadata', mongoMetadataFn)
    .factory('ChartConfiguration', chartConfigurationFn)
    .factory('ChartMetadata', chartMetadataFn);
}(angular.module('standardData')));
