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

export class Server {
    app: express.Application;
    httpServer: http.Server;
    io: SocketIO.Server;
    port: number;
    board: five.Board;
    motor: robot.IMotor;
    radar: robot.IRadar;
    accelerometer: robot.IAccelerometer;
    tcpPort: number;
    serialPort: string;

    constructor(serialPort:string, tcpPort:number){
        this.serialPort = serialPort;
        this.tcpPort = tcpPort;
        this.app = express();
        this.httpServer = require('http').createServer(this.app);
        this.io = sio.listen(this.httpServer);
        this.board = new five.Board({port:this.serialPort});
        this.motor = new robot.Motor(this.board);
        this.radar = new robot.Radar(this.board);  
        this.accelerometer = new robot.Accelerometer(this.board, new robot.AccelerometerOption());
    }  

    public startListening(){
        var that = this;
        this.app.use(bodyParser.json());
        this.app.use(express.static(__dirname + '/public'));
         
        this.app.get('/', function(req, res) {  
                console.log("Serving!")
                res.sendFile(__dirname + '/public/index.html');
        });
        this.app.get('/radar', function(req, res) { res.status(200).send(that.radar.getData()) });
        this.app.get('/accelerometer', function(req, res) { res.status(200).send(that.accelerometer.getData()); });
        this.app.post('/motor', that.motor.actionHandler());
        
        this.httpServer.listen(this.tcpPort);  
        console.log('Server available at http://localhost:' + this.tcpPort);  

    }  

    public startBoard()
    {
        var that = this;
        //Socket connection handler
        this.io.sockets.on('connection', function (socket: SocketIO.Socket) {  
            console.log(socket.id);

            socket.on('motor:forward', function (data) {
               that.motor.forward();
               socket.emit('motor', 'forward');
            });
     
            socket.on('motor:stop', function (data) {
                that.motor.stop();
                socket.emit('motor', 'stop');
            });

            socket.on('motor:reverse', function (data) {
                that.motor.reverse();
                socket.emit('motor', 'reverse');
            });

            socket.on('motor:left', function (data) {
                that.motor.left();
                socket.emit('motor', 'left');
            });

            socket.on('motor:right', function (data) {
                that.motor.right();
                socket.emit('motor', 'right');
            });

            that.radar.on('change', function(data){
                console.log('radar data:' + data )
                socket.emit('radar', data);
            });
        });
        console.log('Waiting for connection');
    }
 
}

// main
var server = new Server("com7", 3000);
server.startBoard();
server.startListening();