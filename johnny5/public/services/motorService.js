(function() {
    'use strict';
    var serviceId = "motorService";
    angular.module('johnny5').factory(serviceId, ['mySocket', motorService]);
	

	
	function motorService(mySocket){
		var service = {
			forward: forward,
			reverse: reverse,
			left: left,
			right: right,
			stop: stop
		}
		return service;

		function forward(){
			mySocket.emit('motor:forward');
		}

		function reverse(){
			mySocket.emit('motor:reverse');
		}

		function left(){
			mySocket.emit('motor:left');
		}

		function right(){
			mySocket.emit('motor:right');
		}

		function stop(){
			mySocket.emit('motor:stop');
		}
	}	

})()	