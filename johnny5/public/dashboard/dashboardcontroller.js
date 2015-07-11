(function() {
    'use strict';
    var controllerId = "dashboardController";
    angular.module('johnny5').controller(controllerId, ['$scope', 'mySocket', dashboardController]);

    function dashboardController($scope, mySocket) {

        $scope.forward = function() {
            mySocket.emit('motor:forward');
            console.log('Going forward!');
        };


        $scope.stop = function() {

            mySocket.emit('motor:stop');
            console.log('Stopping!');
        };

        $scope.reverse = function() {
            mySocket.emit('motor:reverse');
            console.log('Reverse!');
        };

        $scope.left = function() {

            mySocket.emit('motor:left');
            console.log('Left!');
        };

        $scope.right = function() {

            mySocket.emit('motor:right');
            console.log('Right!');
        };
    }
})();