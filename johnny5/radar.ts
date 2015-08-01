///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>

import five = require('johnny-five');
import Emitter = require('events');

export class RadarData {
    constructor(
        public LeftValue: number,
        public MiddleValue: number,
        public RightValue: number) {
    }
}

export interface IRadar extends NodeJS.EventEmitter {
    getData(): RadarData;
    initializeHandler(): any;
}

export class Radar extends Emitter.EventEmitter implements IRadar {

    radarData: RadarData;
    leftPing: any;
    middlePing: any;
    rightPing: any;
    board: five.Board;

    public constructor(board: five.Board) {
        this.radarData = new RadarData(0, 0, 0);
        this.board = board;
        console.log(this.board);
        this.board.on("ready", this.initializeHandler());
        super();
    }

    getData(): RadarData {
        return this.radarData;
    }

    public initializeHandler() {
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
        }
    }
}

export class PinMode {
    static INPUT = 0;
    static OUTPUT = 1;
    static ANALOG = 2;
    static PWM = 3;
    static SERVO = 4;
}