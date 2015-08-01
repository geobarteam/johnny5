///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>
///<reference path=".\lib\express.d.ts"/>
///<reference path=".\lib\body-parser.d.ts"/>
///<reference path=".\lib\socketio.d.ts"/>
///<reference path=".\robot.ts"/>
///<reference path=".\radar.ts"/>
///<reference path=".\motor.ts"/>
///<reference path=".\accelerometer.ts"/>

import express = require('express');  
import five = require("johnny-five");  
import sio = require('socket.io');
import http = require('http');
import bodyParser = require('body-parser');
import accelerometer = require("./accelerometer");
import radar = require("./radar");
import motor = require("./motor");

var comport = "com3";

export class Server {
    app: express.Application;
    httpServer: http.Server;
    io: SocketIO.Server;
    port: number;
    board: five.Board;
    motor: motor.IMotor;
    radar: radar.IRadar;
    accelerometer: accelerometer.IAccelerometer;
    tcpPort: number;
    serialPort: string;

    constructor(serialPort:string, tcpPort:number){
        this.serialPort = serialPort;
        this.tcpPort = tcpPort;
        this.app = express();
        this.httpServer = require('http').createServer(this.app);
        this.io = sio.listen(this.httpServer);
        this.board = new five.Board({ port: this.serialPort });
        this.motor = new motor.Motor(this.board);
        this.radar = new radar.Radar(this.board);
        this.accelerometer = new accelerometer.Accelerometer(this.board, new accelerometer.AccelerometerOption());
        
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

            that.accelerometer.on('change', function(data){
                console.log('accelerometer data:' + data )
                socket.emit('accelerometer', data);
            });
        });
        console.log('Waiting for connection');
    }
 
}

// main
var server = new Server(comport, 3000);
server.startBoard();
server.startListening();