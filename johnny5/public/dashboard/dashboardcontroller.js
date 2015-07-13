(function() {
    'use strict';
    var controllerId = "dashboardController";
    angular.module('johnny5').controller(controllerId, ['$scope', 'motorService', dashboardController]);

    function dashboardController($scope, motorService) {

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