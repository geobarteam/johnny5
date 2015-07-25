///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>
///<reference path=".\lib\express.d.ts"/>
///<reference path=".\lib\body-parser.d.ts"/>
///<reference path=".\lib\socketio.d.ts"/>
///<reference path=".\robot.ts"/>

import express = require('express');  
import five = require("johnny-five");  
import sio = require('socket.io');
import http = require('http');
import bodyParser = require('body-parser');
import robot = require("./robot");

var app        = express();  
var httpServer = http.createServer(app);  
var io = sio.listen(httpServer);
var port = 3000; 
var board = new five.Board({port:"com5"});

var motor = new robot.Motor(board);
var radar = new robot.Radar();


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/public/index.html');
});
app.get('/radar', function(req,res){res.status(200).send(radar.Data)}) 
app.post('/motor', motor.ActionHandler());
httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);  
var led;
 
//Arduino board connection


board.on("ready", radar.InitializeHandler());

//Socket connection handler
io.sockets.on('connection', function (socket: sio.Socket) {  
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
 
