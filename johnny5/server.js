// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io =  require('socket.io')(httpServer);
var motorService = require('./motor.js');
var port = 3000; 
 
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

var motor = new motorService(board);

//Socket connection handler
io.on('connection', function (socket) {  
        console.log(socket.id);

        socket.on('motor:forward', function (data) {
           motor.forward();
           console.log('forward RECEIVED');
        });
 
        socket.on('motor:stop', function (data) {
            motor.stop();
            console.log('stop RECEIVED');
 
        });

        socket.on('motor:reverse', function (data) {
            motor.reverse();
            console.log('reverse RECEIVED');
        });

        socket.on('motor:left', function (data) {
            motor.left();
            console.log('left RECEIVED');
        });

        socket.on('motor:right', function (data) {
            motor.right();
            console.log('right RECEIVED');
        });
    });
 
console.log('Waiting for connection');
 
