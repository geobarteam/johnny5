// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io =  require('socket.io')(httpServer);

var port = 3000; 
var speedL = 1;
var speedR = 1;
var E1 = 6; //M1 Speed Control 
var E2 = 5; //M2 Speed Control 
var M1 = 8; //M1 Direction Control 
var M2 = 7; //M2 Direction Control
var LOW = 0;
var HIGH = 1;
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/public/index.html');
});
 
httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  
var led;
 
//Arduino board connection
 
var board = new five.Board({port:"com5"});  
board.on("ready", function() {  
    console.log('Arduino connected');
    for (var i = 5; i <= 8; i++) {
        this.pinMode(i, this.MODES.OUTPUT);
    }
});
 
//Socket connection handler
io.on('connection', function (socket) {  
        console.log(socket.id);
 
        socket.on('motor:forward', function (data) {
           forward(speedL,speedR);
           console.log('forward RECEIVED');
        });
 
        socket.on('motor:stop', function (data) {
            stop();
            console.log('stop RECEIVED');
 
        });

        socket.on('motor:reverse', function (data) {
            reverse(speedL,speedR);
            console.log('reverse RECEIVED');
        });

        socket.on('motor:left', function (data) {
            left(speedL,speedR);
            console.log('left RECEIVED');
        });

        socket.on('motor:right', function (data) {
            right(speedL,speedR);
            console.log('right RECEIVED');
        });
    });
 
console.log('Waiting for connection');
 
var forward = function(left, right){
    board.analogWrite(E1, right);
    board.digitalWrite(M1, LOW);
    board.analogWrite(E2, left);
    board.digitalWrite(M2, LOW);
    stopStep();
};

var stop = function() {  
  board.digitalWrite(E1,LOW);  
  board.digitalWrite(E2,LOW); 
};

var reverse = function(left, right){
    board.analogWrite(E1, right);
    board.digitalWrite(M1, HIGH);
    board.analogWrite(E2, left);
    board.digitalWrite(M2, HIGH);
    stopStep();
};

var left = function(left, right) 
{  
  board.analogWrite (E1,right);  
  board.digitalWrite(M1,HIGH);  
  board.analogWrite (E2,left);  
  board.digitalWrite(M2,LOW); 
  stopStep();
};

var right = function(left, right) 
{  
  board.analogWrite (E1,right);  
  board.digitalWrite(M1,LOW);  
  board.analogWrite (E2,left);  
  board.digitalWrite(M2,HIGH); 
  stopStep();
};

var stopStep = function(){
    board.wait(1000, function(){
        board.digitalWrite(E1,LOW); 
    });
    board.wait(800, function(){
        board.digitalWrite(E2,LOW); 
    });
};