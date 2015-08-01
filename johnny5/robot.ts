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

export class Radar extends Emitter.EventEmitter implements IRadar{
 
	radarData: RadarData;
	leftPing: any;
	middlePing: any;
	rightPing: any;
	board: five.Board;

	public constructor(board:five.Board) {
		this.radarData = new RadarData(0, 0, 0);
		this.board = board;
		console.log(this.board);
		this.board.on("ready", this.initializeHandler());
		super();
	}

	getData(): RadarData {
		return this.radarData;
	}

	public initializeHandler(){
		var radar = this;

		return function(){ 
		    console.log('Arduino connected');
		    for (var i = 5; i <= 8; i++) {
		        radar.board.pinMode(i, PinMode.OUTPUT);
		    }

		    radar.leftPing = new five.Ping(11);
			radar.middlePing = new five.Ping(12);
			radar.rightPing = new five.Ping(13);

			radar.leftPing.on("change", function() {
				radar.radarData.LeftValue = this.cm;
				radar.emit("change", radar.radarData);
			});
			radar.middlePing.on("change", function() {
				radar.radarData.MiddleValue = this.cm;
				radar.emit("change", radar.radarData);
			});
			radar.rightPing.on("change", function() {
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

export interface IMotor {
	actionHandler():any;
	stop();
	forward();
	left();
	right();
	reverse();
}

export class Motor implements IMotor{

	board: any;
	speedL: number;
	speedR: number;
	E1: number;
	E2: number;
	M1: number;
	M2: number;
	LOW: number;
	HIGH: number;

	constructor(board: five.Board) {
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

	private stopStep() {
		var that = this;
		this.board.wait(1000, function() {
			that.board.digitalWrite(that.E1, that.LOW);
		});
		this.board.wait(800, function() {
			that.board.digitalWrite(that.E2, that.LOW);
		});
	}

	forward() {
		this.board.analogWrite(this.E1, this.speedR);
		this.board.digitalWrite(this.M1, this.LOW);
		this.board.analogWrite(this.E2, this.speedL);
		this.board.digitalWrite(this.M2, this.LOW);
		this.stopStep();
	}

	stop() {
		this.board.digitalWrite(this.E1, this.LOW);
		this.board.digitalWrite(this.E2, this.LOW);
	}

	reverse() {
		this.board.analogWrite(this.E1, this.speedR);
		this.board.digitalWrite(this.M1, this.HIGH);
		this.board.analogWrite(this.E2, this.speedL);
		this.board.digitalWrite(this.M2, this.HIGH);
		this.stopStep();
	}

	left() {
		this.board.analogWrite(this.E1, this.speedR);
		this.board.digitalWrite(this.M1, this.HIGH);
		this.board.analogWrite(this.E2, this.speedL);
		this.board.digitalWrite(this.M2, this.LOW);
		this.stopStep();
	}

	right() {
		this.board.analogWrite(this.E1, this.speedR);
		this.board.digitalWrite(this.M1, this.LOW);
		this.board.analogWrite(this.E2, this.speedL);
		this.board.digitalWrite(this.M2, this.HIGH);
		this.stopStep();
	}

	public actionHandler(){
		var motor = this;
        return function(req,res){
        	console.log(req.body);
	        if (req.body.action =="forward"){
	            motor.forward();
	        }
	        if (req.body.action =="stop"){
	            motor.stop();
	        }
	        if (req.body.action =="reverse"){
	            motor.reverse();
	        }
	        if (req.body.action =="left"){
	            motor.left();
	        }
	        if (req.body.action =="right"){
	            motor.right();
	        }
    	}
	}	
}

export class AccelerometerData{
	public x: number;
	public y: number;
	public z: number;
	public pitch: number;
	public roll: number;
	public acceleration: number;
	public inclination: number;
	public orientation: number;
}

export interface IAccelerometer extends NodeJS.EventEmitter{
	getData(): AccelerometerData;		
}

export class AccelerometerOption implements five.AccelerometerMMA7361Option{
	controller = "MMA7361";
    pins = ["A0", "A1", "A2"];
    sleepPin= 13;
    autoCalibrate= true;
}

export class Accelerometer extends Emitter.EventEmitter implements IAccelerometer{
	accelerometer: five.Accelerometer;
	board: five.Board;
	data: AccelerometerData;
	option: five.AccelerometerMMA7361Option;

	constructor(board: five.Board, option: five.AccelerometerMMA7361Option){
		this.board = board;
		this.option = option;
		this.data = new AccelerometerData();
		var that = this;
		this.board.on("ready", function(){
			that.accelerometer = new five.Accelerometer(that.option);
			that.accelerometer.on("change", function() {
				that.data.acceleration = this.acceleration;
				that.data.inclination = this.inclination;
				that.data.orientation = this.orientation;
				that.data.x = this.x;
				that.data.y = this.y;
				that.data.pitch = this.pitch;
				that.data.roll = this.roll;
				that.emit("change", that.data)
			});
		})
		
		super();
	}

	public getData(): AccelerometerData{
		return this.data;
	}
	
}

