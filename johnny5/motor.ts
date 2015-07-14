class Motor{
	
	board : any;
	speedL: number;
	speedR : number;
	E1 : number;
	E2 : number;
	M1 : number;
	M2 : number;
	LOW : number;
	HIGH : number;

	constructor(board:any)
	{
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

	stopStep() {
		var that = this;
		this.board.wait(1000, function(){
			that.board.digitalWrite(that.E1,that.LOW); 
		});
		this.board.wait(800, function(){
			that.board.digitalWrite(that.E2,that.LOW); 
		});
	};

	forward() {
		this.board.analogWrite(this.E1, this.speedR);
		this.board.digitalWrite(this.M1, this.LOW);
		this.board.analogWrite(this.E2, this.speedL);
		this.board.digitalWrite(this.M2, this.LOW);
		this.stopStep();
	};

	stop() {  
		this.board.digitalWrite(this.E1, this.LOW);  
		this.board.digitalWrite(this.E2, this.LOW); 
	};

	reverse() {
		this.board.analogWrite(this.E1, this.speedR);
		this.board.digitalWrite(this.M1, this.HIGH);
		this.board.analogWrite(this.E2, this.speedL);
		this.board.digitalWrite(this.M2, this.HIGH);
		this.stopStep();
	};

	left() 
	{  
		this.board.analogWrite (this.E1,this.speedR);  
		this.board.digitalWrite(this.M1,this.HIGH);  
		this.board.analogWrite (this.E2,this.speedL);  
		this.board.digitalWrite(this.M2,this.LOW); 
		this.stopStep();
	};

	right(left, right) 
	{  
		this.board.analogWrite (this.E1,this.speedR);  
		this.board.digitalWrite(this.M1,this.LOW);  
		this.board.analogWrite (this.E2,this.speedL);  
		this.board.digitalWrite(this.M2,this.HIGH); 
		this.stopStep();
	};
}
module.exports = Motor;