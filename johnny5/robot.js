///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var five = require('johnny-five');
var Emitter = require('events');
var RadarData = (function () {
    function RadarData(LeftValue, MiddleValue, RightValue) {
        this.LeftValue = LeftValue;
        this.MiddleValue = MiddleValue;
        this.RightValue = RightValue;
    }
    return RadarData;
})();
exports.RadarData = RadarData;
var Radar = (function (_super) {
    __extends(Radar, _super);
    function Radar(board) {
        this.radarData = new RadarData(0, 0, 0);
        this.board = board;
        this.board.on("ready", this.initializeHandler);
        _super.call(this);
    }
    Radar.prototype.getData = function () {
        return this.radarData;
    };
    Radar.prototype.initializeHandler = function () {
        var radar = this;
        return function () {
            console.log('Arduino connected');
            for (var i = 5; i <= 8; i++) {
                radar.board.pinMode(i, PinMode.OUTPUT);
            }
            radar.leftPing = new five.Ping(11);
            radar.middlePing = new five.Ping(12);
            radar.rightPing = new five.Ping(13);
            radar.leftPing.on("change", function () {
                radar.radarData.LeftValue = this.cm;
                radar.emit("change", radar.radarData);
            });
            radar.middlePing.on("change", function () {
                radar.radarData.MiddleValue = this.cm;
                radar.emit("change", radar.radarData);
            });
            radar.rightPing.on("change", function () {
                radar.radarData.RightValue = this.cm;
                radar.emit("change", radar.radarData);
            });
        };
    };
    return Radar;
})(Emitter.EventEmitter);
exports.Radar = Radar;
var PinMode = (function () {
    function PinMode() {
    }
    PinMode.INPUT = 0;
    PinMode.OUTPUT = 1;
    PinMode.ANALOG = 2;
    PinMode.PWM = 3;
    PinMode.SERVO = 4;
    return PinMode;
})();
exports.PinMode = PinMode;
var Motor = (function () {
    function Motor(board) {
        this.board = board;
        this.speedL = 1;
        this.speedR = 1;
        this.E1 = 6; //M1 Speed Control 
        this.E2 = 5; //M2 Speed Control 
        this.M1 = 8; //M1 Direction Control 
        this.M2 = 7; //M2 Direction Control
        this.LOW = 0;
        this.HIGH = 1;
    }
    Motor.prototype.stopStep = function () {
        var that = this;
        this.board.wait(1000, function () {
            that.board.digitalWrite(that.E1, that.LOW);
        });
        this.board.wait(800, function () {
            that.board.digitalWrite(that.E2, that.LOW);
        });
    };
    Motor.prototype.forward = function () {
        this.board.analogWrite(this.E1, this.speedR);
        this.board.digitalWrite(this.M1, this.LOW);
        this.board.analogWrite(this.E2, this.speedL);
        this.board.digitalWrite(this.M2, this.LOW);
        this.stopStep();
    };
    Motor.prototype.stop = function () {
        this.board.digitalWrite(this.E1, this.LOW);
        this.board.digitalWrite(this.E2, this.LOW);
    };
    Motor.prototype.reverse = function () {
        this.board.analogWrite(this.E1, this.speedR);
        this.board.digitalWrite(this.M1, this.HIGH);
        this.board.analogWrite(this.E2, this.speedL);
        this.board.digitalWrite(this.M2, this.HIGH);
        this.stopStep();
    };
    Motor.prototype.left = function () {
        this.board.analogWrite(this.E1, this.speedR);
        this.board.digitalWrite(this.M1, this.HIGH);
        this.board.analogWrite(this.E2, this.speedL);
        this.board.digitalWrite(this.M2, this.LOW);
        this.stopStep();
    };
    Motor.prototype.right = function () {
        this.board.analogWrite(this.E1, this.speedR);
        this.board.digitalWrite(this.M1, this.LOW);
        this.board.analogWrite(this.E2, this.speedL);
        this.board.digitalWrite(this.M2, this.HIGH);
        this.stopStep();
    };
    Motor.prototype.actionHandler = function () {
        var motor = this;
        return function (req, res) {
            console.log(req.body);
            if (req.body.action == "forward") {
                motor.forward();
            }
            if (req.body.action == "stop") {
                motor.stop();
            }
            if (req.body.action == "reverse") {
                motor.reverse();
            }
            if (req.body.action == "left") {
                motor.left();
            }
            if (req.body.action == "right") {
                motor.right();
            }
        };
    };
    return Motor;
})();
exports.Motor = Motor;
var AccelerometerData = (function () {
    function AccelerometerData() {
    }
    return AccelerometerData;
})();
exports.AccelerometerData = AccelerometerData;
var AccelerometerOption = (function () {
    function AccelerometerOption() {
        this.controller = "MMA7361";
        this.pins = ["A0", "A1", "A2"];
        this.sleepPin = 13;
        this.autoCalibrate = true;
    }
    return AccelerometerOption;
})();
exports.AccelerometerOption = AccelerometerOption;
var Accelerometer = (function (_super) {
    __extends(Accelerometer, _super);
    function Accelerometer(board, option) {
        this.board = board;
        this.option = option;
        this.data = new AccelerometerData();
        var that = this;
        this.board.on("ready", function () {
            that.accelerometer = new five.Accelerometer(that.option);
            that.accelerometer.on("change", function () {
                that.data.acceleration = this.acceleration;
                that.data.inclination = this.inclination;
                that.data.orientation = this.orientation;
                that.data.x = this.x;
                that.data.y = this.y;
                that.data.pitch = this.pitch;
                that.data.roll = this.roll;
                that.emit("change", that.data);
            });
        });
        _super.call(this);
    }
    Accelerometer.prototype.getData = function () {
        return this.data;
    };
    return Accelerometer;
})(Emitter.EventEmitter);
exports.Accelerometer = Accelerometer;
