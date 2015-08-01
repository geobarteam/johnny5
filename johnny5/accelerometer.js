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
        this.sleepPin = 10;
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
                that.data.z = this.z;
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
//# sourceMappingURL=accelerometer.js.map