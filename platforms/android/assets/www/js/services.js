angular.module('starter.services', [])

    .factory('Parts', function () {
        var parts = [
            {
                id: 0,
                name: 'CORE',
                type: 'control',
                mass: 1.5,
                data: {
                    shape: 'circle',
                    dynamic: {
                        fill: 'purple',
                        cx: 0,
                        cy: 20,
                        r: 10
                    }
                },
                nodes: [
                    {x: 0, y: 1},
                    {x: 0, y: -1}
                ]
            }, {
                id: 1,
                name: 'TANK',
                type: 'fuel',
                mass: 6,
                data: {
                    shape: 'rect',
                    dynamic: {
                        fill: 'black',
                        x: 0,
                        y: 0,
                        height: 2,
                        width: 8,
                        rx: 1,
                        ry: 1
                    }
                },
                nodes: [
                    {x: 0, y: 1},
                    {x: 0, y: -1}
                ]
            }, {
                id: 2,
                name: 'THRUST',
                type: 'fuel',
                mass: 4,
                data: {
                    shape: 'rect',
                    dynamic: {
                        fill: 'black',
                        x: 0,
                        y: 0,
                        height: 2,
                        width: 8,
                        rx: 1,
                        ry: 1
                    }
                },
                nodes: [
                    {x: 0, y: 1},
                    {x: 0, y: -1}
                ]
            }
        ], onlyUnique = function (value, index, self) {
            return self.indexOf(value) === index;
        }, getPart = function (partId) {
            var part = null,
                hasPart = parts.some(function (element) {
                    part = element;
                    return element.id === partId;
                });
            return hasPart ? part : null;
        }, getPartsForShip = function (ship) {
            var parts = [];
            angular.forEach(ship.partIds.filter(onlyUnique), function (partId) {
                parts.push(getPart(partId));
            });
            return parts;
        };


        return {
            all: function () {
                return parts;
            },
            get: getPart,
            getForShip: getPartsForShip,
            getMassForShip: function (ship, parts) {
                var mass = 0,
                    parts = parts || getPartsForShip(ship);
                angular.forEach(parts, function (part) {
                    mass += part.mass;
                });
                return mass;
            }
        };
    })
    .factory('Ships', function () {
        var ships = [
            {
                id: 0,
                name: 'TIE fighter',
                partIds: [0, 1, 2],
                connections: [
                    {
                        top: {
                            partOrdinal: 0,
                            nodeOrdinal: 1
                        },
                        bot: {
                            partOrdinal: 1,
                            nodeOrdinal: 0
                        }
                    }, {
                        top: {
                            partOrdinal: 1,
                            nodeOrdinal: 1
                        },
                        bot: {
                            partOrdinal: 2,
                            nodeOrdinal: 0
                        }
                    }
                ]
            }
        ];

        return {
            all: function () {
                return ships;
            },
            get: function (shipId) {
                var ship = null,
                    isShip = false,
                    hasShip = ships.some(function (element) {
                        isShip = element.id == shipId;
                        console.log('element:' + element.id + ' isShip:' + isShip);
                        if (isShip) {
                            ship = element;
                        }
                        return isShip;
                    });
                return hasShip ? ship : null;
            },
            new: function () {
                ships.push({
                    id: ships.length,
                    name: 'New Ship',
                    partIds: [],
                    connections: []
                });
                return ships.slice(-1)[0];
            }
        };
    });
