(function() {
    "use strict";
    angular.module('standardBoilerplate', [])
        .directive('headBoilerplate', ['$rootScope', '$compile', '$http', function ($rootScope, $compile, $http) {
            var templateUrl = 'templates/standard-boilerplate-head.html';
            return {
                restrict: 'A',
                scope: {
                    title: '@',
                    description: '@',
                    canonical: '@',
                    icon: '@',
                    startupIcon: '@'
                },
                link: function ($scope) {
                    $http.get(templateUrl).then(function (response) {
                        angular.element('head').append($compile(response.data)($scope));
                    });
                }
            };
        }])
        .directive('googleAnalyticsBoilerplate', ['$window', '$document', function ($window, $document) {
            return {
                restrict: 'E',
                scope: {
                    apiKey: '@'
                },
                link: function ($scope) {
                    (function (i, s, o, g, r, a, m) {
                        i['GoogleAnalyticsObject'] = r;
                        i[r] = i[r] || function () {
                            (i[r].q = i[r].q || []).push(arguments)
                        }, i[r].l = 1 * new Date();
                        a = s.createElement(o),
                            m = s.getElementsByTagName(o)[0];
                        a.async = 1;
                        a.src = g;
                        m.parentNode.insertBefore(a, m)
                    }($window, $document[0], 'script', '//www.google-analytics.com/analytics.js', 'ga'));
    
                    ga('create', $scope.apiKey, 'auto');
                    ga('send', 'pageview');
                }
            };
        }])
        .directive('facebookBoilerplate', function () {
            return {
                restrict: 'E',
                require: 'facebookBoilerplateScript',
                scope: {
                    appId: '@'
                },
                template: '<div id="fb-root"></div><facebook-boilerplate-script app-id="{{appId}}"></facebook-boilerplate-script>'
            };
        })
        .directive('facebookBoilerplateScript', ['$document', function ($document) {
            return {
                restrict: 'E',
                scope: {
                    appId: '@'
                },
                link: function ($scope) {
                    (function (d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) return;
                        js = d.createElement(s);
                        js.id = id;
                        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=" + $scope.appId + "&version=v2.0";
                        fjs.parentNode.insertBefore(js, fjs);
                    }($document[0], 'script', 'facebook-jssdk'));
                }
            };
        }]);
}).call(this);

//# sourceMappingURL=standard-boilerplate.js.map