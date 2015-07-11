(function() {
    'use strict';
    var controllerId = "dashboardController";
    angular.module('johnny5').controller(controllerId, ['$scope', 'mySocket', dashboardController]);


})()