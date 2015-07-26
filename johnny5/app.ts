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
    io: sio.Manager;
    port: number;
    board: five.Board;
    motor: robot.Motor;
    radar: robot.Radar;
    tcpPort: number;
    serialPort: string;

    constructor(serialPort:string, tcpPort:number){
        this.serialPort = serialPort;
        this.tcpPort = tcpPort;
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.io = sio.listen(this.httpServer);
        this.board = new five.Board({port:this.serialPort});
        this.motor = new robot.Motor(this.board);
        this.radar = new robot.Radar(this.board);
       
    }  

    public startListening(){
        this.app.use(bodyParser.json());
        this.app.use(express.static(__dirname + '/public'));
         
        this.app.get('/', function(req, res) {  
                console.log("Serving!")
                res.sendFile(__dirname + '/public/index.html');
        });
        this.app.get('/radar', function(req,res){res.status(200).send(this.radar.Data)}) 
        this.app.post('/motor', this.motor.ActionHandler());
        
        this.httpServer.listen(this.tcpPort);  
        console.log('Server available at http://localhost:' + this.tcpPort);  

    }  
    public startBoard()
    {
        var that = this;
        this.board.on("ready", this.radar.InitializeHandler());

        //Socket connection handler
        this.io.sockets.on('connection', function (socket: sio.Socket) {  
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
server.startListening();
server.startBoard();











 
