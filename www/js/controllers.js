(function (module) {
    module
        .controller('DashCtrl', function ($scope) {
            console.log('start-dash');
        })

        .controller('BuildCtrl', function ($scope, $stateParams, Ships, Parts) {
            // TODO: Serialize this
            // TODO: Part preview (SVG)

            if ($stateParams.shipId) {
                if ($stateParams.shipId == -1) {
                    $scope.ship = Ships.new();
                }
                else {
                    $scope.ship = Ships.get($stateParams.shipId);
                }
                $scope.parts = Parts.getForShip($scope.ship);
                $scope.shipMass = Parts.getMassForShip($scope.ship, $scope.parts);
            }
            else {
                $scope.ships = Ships.all();
                $scope.getMassForShip = Parts.getMassForShip;
            }
        })

        .controller('SpaceCtrl', function ($scope, $document, $interval, $stateParams, Ships, Parts) {
            console.log('start-space');
            var ship = Ships.get($stateParams.shipId),
                parts = Parts.getForShip(ship);
            $scope.config = {
                defaults: {
                    bounds: {
                        xMin: -50,
                        yMin: -50,
                        xMax: 50,
                        yMax: 50
                    }
                },
                cursorPoint: {},
                data: parts

            };
            /*
                    {
                        name: 'ship',
                        x: 10,
                        y: 50,
                        opacity: 1,
                        fill: 'black',
                        r: 2
                    },
                    {
                        name: 'ship-thruster',
                        x: 10,
                        y: 48,
                        opacity: 0,
                        fill: 'red',
                        r: 1
                    }
                ]
            };
            */


            var ship = $scope.config.data[0].data.dynamic,
                thruster = $scope.config.data[1].data.dynamic,
                gravity = -9.8,
                velocity = 20,
                deltaScaled = 0;

            $scope.drawInterval = 50;
            var getScaled = function (value) {
                return value * $scope.drawInterval / 1000;
            }

            var startThrust = function () {
                $scope.thrust = 40;
                thruster.opacity = 1;
            }, endThrust = function () {
                $scope.thrust = 0;
                thruster.opacity = 0;
            };

            $scope.tapStart = function () {
                if ($scope.thrust) return;
                console.log('tap-start')
                startThrust();
            }

            $scope.tapEnd = function () {
                console.log('tap-end')
                endThrust();
            }

            $interval(function () {
                if ($scope.thrust == 0 && ship.cy <= 0) {
                    velocity = 0;
                    ship.cy = 0;
                };

                velocity += getScaled($scope.thrust + gravity); // velocity will change by scaled value
                deltaScaled = getScaled(velocity);

                if (ship.cy >= -1 * deltaScaled) {
                    ship.cy += deltaScaled;
                }
                else {
                    ship.cy = 0;
                    velocity = 0;
                }
                thruster.y = ship.cy - 2;
            }, $scope.drawInterval)
        })

        .controller('AccountCtrl', function ($scope) {
            $scope.settings = {
                enableFriends: true
            };
        });
}(angular.module('starter.controllers', [])))
