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
        console.log(this.board);
        this.board.on("ready", this.initializeHandler());
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
//# sourceMappingURL=radar.js.map