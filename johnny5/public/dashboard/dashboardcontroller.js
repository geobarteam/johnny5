(function() {
    'use strict';
    var controllerId = "dashboardController";
    angular.module('johnny5').controller(controllerId, ['$scope', 'motorService','mySocket', dashboardController]);

    function dashboardController($scope, motorService, mySocket) {
        mySocket.on('motor', function(data){
            $scope.motorState = data;
        })    

        $scope.forward = function() {
            motorService.forward();
        };

        $scope.stop = function() {
            motorService.stop();
        };

        $scope.reverse = function() {
            motorService.reverse();
        };

        $scope.left = function() {
            motorService.left();
        };

        $scope.right = function() {
            motorService.right();
        };
    }
})();