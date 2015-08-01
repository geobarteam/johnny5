///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>

import five = require('johnny-five');
import Emitter = require('events');

export class AccelerometerData {
    public x: number;
    public y: number;
    public z: number;
    public pitch: number;
    public roll: number;
    public acceleration: number;
    public inclination: number;
    public orientation: number;
}

export interface IAccelerometer extends NodeJS.EventEmitter {
    getData(): AccelerometerData;
}

export class AccelerometerOption implements five.AccelerometerMMA7361Option {
    controller = "MMA7361";
    pins = ["A0", "A1", "A2"];
    sleepPin = 10;
    autoCalibrate = true;
}

export class Accelerometer extends Emitter.EventEmitter implements IAccelerometer {
    accelerometer: five.Accelerometer;
    board: five.Board;
    data: AccelerometerData;
    option: five.AccelerometerMMA7361Option;

    constructor(board: five.Board, option: five.AccelerometerMMA7361Option) {
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
                that.emit("change", that.data)
            });
        })

        super();
    }

    public getData(): AccelerometerData {
        return this.data;
    }

}

