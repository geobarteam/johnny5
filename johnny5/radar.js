///<reference path=".\contracts\RadarData.ts" />
///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var five = require('johnny-five');
var Emitter = require('events');
var Johnny5;
(function (Johnny5) {
    var RadarData = (function () {
        function RadarData(LeftValue, MiddleValue, RightValue) {
            this.LeftValue = LeftValue;
            this.MiddleValue = MiddleValue;
            this.RightValue = RightValue;
        }
        return RadarData;
    })();
    Johnny5.RadarData = RadarData;
    var Radar = (function (_super) {
        __extends(Radar, _super);
        function Radar() {
            this.radarData = new RadarData(0, 0, 0);
            _super.call(this);
        }
        Radar.prototype.startListening = function () {
            this.leftPing = new five.Ping(11);
            this.middlePing = new five.Ping(12);
            this.rightPing = new five.Ping(13);
            var that = this;
            this.leftPing.on("change", function () {
                that.radarData.LeftValue = this.cm;
                that.emit("change", that.radarData);
            });
            this.middlePing.on("change", function () {
                that.radarData.MiddleValue = this.cm;
                that.emit("change", that.radarData);
            });
            this.rightPing.on("change", function () {
                that.radarData.RightValue = this.cm;
                that.emit("change", that.radarData);
            });
        };
        return Radar;
    })(Emitter.EventEmitter);
    Johnny5.Radar = Radar;
})(Johnny5 || (Johnny5 = {}));
module.exports = Johnny5.Radar;
//# sourceMappingURL=radar.js.map