///<reference path=".\lib\node.d.ts"/>
///<reference path=".\lib\johnny-five.d.ts"/>

import five = require('johnny-five');
import Emitter = require('events');

export interface IMotor {
    actionHandler(): any;
    stop();
    forward();
    left();
    right();
    reverse();
}

export class Motor implements IMotor {

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
        this.board.wait(1000, function () {
            that.board.digitalWrite(that.E1, that.LOW);
        });
        this.board.wait(800, function () {
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

    public actionHandler() {
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
        }
    }
}