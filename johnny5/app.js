///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>
///<reference path=".\lib\express.d.ts"/>
///<reference path=".\lib\body-parser.d.ts"/>
///<reference path=".\lib\socketio.d.ts"/>
///<reference path=".\robot.ts"/>
var express = require('express');
var five = require("johnny-five");
var sio = require('socket.io');
var http = require('http');
var bodyParser = require('body-parser');
var robot = require("./robot");
var Server = (function () {
    function Server(serialPort, tcpPort) {
        this.serialPort = serialPort;
        this.tcpPort = tcpPort;
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.io = sio.listen(this.httpServer);
        this.board = new five.Board({ port: this.serialPort });
        this.motor = new robot.Motor(this.board);
        this.radar = new robot.Radar(this.board);
    }
    Server.prototype.startListening = function () {
        this.app.use(bodyParser.json());
        this.app.use(express.static(__dirname + '/public'));
        this.app.get('/', function (req, res) {
            console.log("Serving!");
            res.sendFile(__dirname + '/public/index.html');
        });
        this.app.get('/radar', function (req, res) { res.status(200).send(this.radar.Data); });
        this.app.post('/motor', this.motor.ActionHandler());
        this.httpServer.listen(this.tcpPort);
        console.log('Server available at http://localhost:' + this.tcpPort);
    };
    Server.prototype.startBoard = function () {
        var that = this;
        this.board.on("ready", this.radar.InitializeHandler());
        //Socket connection handler
        this.io.sockets.on('connection', function (socket) {
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
            that.radar.on('change', function (data) {
                console.log('radar data:' + data);
                socket.emit('radar', data);
            });
        });
        console.log('Waiting for connection');
    };
    return Server;
})();
exports.Server = Server;
// main
var server = new Server("com7", 3000);
server.startBoard();
server.startListening();
