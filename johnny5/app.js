///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>
///<reference path=".\lib\express.d.ts"/>
///<reference path=".\lib\body-parser.d.ts"/>
///<reference path=".\lib\socketio.d.ts"/>
///<reference path=".\robot.ts"/>
var express = require('express');
var five = require("johnny-five");
var sio = require('socket.io');
var bodyParser = require('body-parser');
var robot = require("./robot");
var Server = (function () {
    function Server(serialPort, tcpPort) {
        this.serialPort = serialPort;
        this.tcpPort = tcpPort;
        this.app = express();
        this.httpServer = require('http').createServer(this.app);
        this.io = sio.listen(this.httpServer);
        this.board = new five.Board({ port: this.serialPort });
        this.motor = new robot.Motor(this.board);
        this.radar = new robot.Radar(this.board);
        this.accelerometer = new robot.Accelerometer(this.board, new robot.AccelerometerOption());
    }
    Server.prototype.startListening = function () {
        var that = this;
        this.app.use(bodyParser.json());
        this.app.use(express.static(__dirname + '/public'));
        this.app.get('/', function (req, res) {
            console.log("Serving!");
            res.sendFile(__dirname + '/public/index.html');
        });
        this.app.get('/radar', function (req, res) { res.status(200).send(that.radar.getData()); });
        this.app.get('/accelerometer', function (req, res) { res.status(200).send(that.accelerometer.getData()); });
        this.app.post('/motor', that.motor.actionHandler());
        this.httpServer.listen(this.tcpPort);
        console.log('Server available at http://localhost:' + this.tcpPort);
    };
    Server.prototype.startBoard = function () {
        var that = this;
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
            that.accelerometer.on('change', function (data) {
                console.log('accelerometer data:' + data);
                socket.emit('accelerometer', data);
            });
        });
        console.log('Waiting for connection');
    };
    return Server;
})();
exports.Server = Server;
// main
var server = new Server("com3", 3000);
server.startBoard();
server.startListening();
