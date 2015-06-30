var five = require("johnny-five");
var board = new five.Board({port:"com5"})
var E1 = 6; //M1 Speed Control 
var E2 = 5; //M2 Speed Control 
var M1 = 8; //M1 Direction Control 
var M2 = 7; //M2 Direction Control
var leftspeed = 255;  //255 is maximum speed   
var rightspeed = 255;  
var LOW = 0;
var HIGH = 1;

board.on("ready", function() {
  for (var i = 5; i <= 8; i++) {
  	this.pinMode(i, this.MODES.OUTPUT);
  }

  this.repl.inject(repldef(this));
});

var forward = function(board, a,b){
	board.analogWrite(E1, a);
	board.digitalWrite(M1, HIGH);
	board.analogWrite(E2, b);
	board.digitalWrite(M2, HIGH);
}

var stop = function(board) 
{  
  board.digitalWrite(E1,LOW);  
  board.digitalWrite(E2,LOW); 
}

var repldef = function(board){
	var result = {
		forward: function(){
			forward(board, leftspeed, rightspeed);
			return 1;
		},
		stop: function(){
			stop(board);
			return 1;
		}
	};
	return result;
}

