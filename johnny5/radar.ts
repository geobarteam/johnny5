///<reference path=".\Contracts.ts" />
///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>

import five = require('johnny-five');
var Emitter = require('events');

export module Johnny5 {

	export class RadarData {
        constructor(
            public LeftValue: number,
            public MiddleValue: number,
            public RightValue: number) {
        }
    }

	export class Radar extends Emitter.EventEmitter {

		radarData: RadarData;
		leftPing: any;
		middlePing: any;
		rightPing: any;

		public constructor() {
			this.radarData = new RadarData(0, 0, 0);
			super();
		}

		get Data(): RadarData {
			return this.radarData;
		}

		public startListening() {

			this.leftPing = new five.Ping(11);
			this.middlePing = new five.Ping(12);
			this.rightPing = new five.Ping(13);

			var that = this;

			this.leftPing.on("change", function() {
				that.radarData.LeftValue = this.cm;
				that.emit("change", that.radarData);
			});
			this.middlePing.on("change", function() {
				that.radarData.MiddleValue = this.cm;
				that.emit("change", that.radarData);
			});
			this.rightPing.on("change", function() {
				that.radarData.RightValue = this.cm;
				that.emit("change", that.radarData);
			});
		}
	}
}
module.exports = Johnny5.Radar;