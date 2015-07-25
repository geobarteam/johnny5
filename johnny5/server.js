// server.js
var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io =  require('socket.io')(httpServer);
var bodyParser = require('body-parser');
var port = 3000; 
var bodyParser = require('body-parser');

var board = new five.Board({port:"com5"});
var robot = require("./robot.js");
var motor = new robot.Motor(board);
var radar = new robot.Radar();
console.log(motor);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/public/index.html');
});
app.get('/radar', function(req,res){res.status(200).send(radar.Data)}) 
app.post('/motor', motor.ActionHandler(motor));
httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  
var led;
 
//Arduino board connection


board.on("ready", radar.InitializeHandler());

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
 
