// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io =  require('socket.io')(httpServer);
var motorService = require('./motor.js');
var port = 3000; 
var radarService = require('./radar.js');
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/public/index.html');
});
 
httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  
var led;
 
//Arduino board connection
var board = new five.Board({port:"com5"});

var motor = new motorService(board);
var radar = new radarService();

board.on("ready", function() {  
    console.log('Arduino connected');
    for (var i = 5; i <= 8; i++) {
        this.pinMode(i, this.MODES.OUTPUT);
    }

    radar.startListening();
});



//Socket connection handler
io.on('connection', function (socket) {  
        console.log(socket.id);

        socket.on('motor:forward', function (data) {
           motor.forward();
           socket.emit('motor', 'forward');
        });
 
        socket.on('motor:stop', function (data) {
            motor.stop();
            socket.emit('motor', 'stop');
 
        });

        socket.on('motor:reverse', function (data) {
            motor.reverse();
            socket.emit('motor', 'reverse');
        });

        socket.on('motor:left', function (data) {
            motor.left();
            socket.emit('motor', 'left');
        });

        socket.on('motor:right', function (data) {
            motor.right();
            socket.emit('motor', 'right');
        });

        radar.on('change', function(data){
            console.log('radar data:' + data )
            socket.emit('radar', data);
        });
    });



console.log('Waiting for connection');
 
