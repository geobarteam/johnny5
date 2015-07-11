(function() {
    var app = angular.module('johnny5', ['btford.socket-io']).
    factory('mySocket', function(socketFactory) {
        return socketFactory();
    });
})();