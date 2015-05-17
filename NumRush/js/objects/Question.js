(function() {

function Question(set) {
	this.Container_constructor(); // Basically: super();
	
	// Positioning
	this.width = layout.QUES_WIDTH;
	this.height = layout.QUES_HEIGHT;
	this.color = layout.QUES_COLOR;

	// Question
	this.operands = set[0];
	this.operators = set[1];
	this.answer = set[2];

	this.getQuestion = function() {
		var string = "";

		for (operand = 0; operand < this.operands.length; operand++) {
			// Check if last operand 
			if (operand == this.operands.length - 1) {
				string += this.operands[operand];
			} else {
				string += this.operands[operand] + " " + this.operators[operand] + " ";
			}
		}
        return string;
    }

	this.label = this.getQuestion();

	this.setup();
}
// Basically: ... Button extends Container ...  
var p = createjs.extend(Question, createjs.Container); 


p.setup = function() {
	var fontSize = this.height * 0.40;
    var font = fontSize + "px Arial"; // TODO: make a global font
	var text = new createjs.Text(this.label, "20px Arial", "#000");
	text.textBaseline = "middle";
	text.textAlign = "center";
	
	// cordinates for the text to be drawn 
	text.x = this.width/2; // x is not top-left but the center
	text.y = this.height/2;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(this.color).drawRoundRect(0,0,this.width,this.height,10);

	// Note: this refers to the container
	this.addChild(background, text);  // Container class method
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	// Container cordinates 
	this.x = 0;
	this.y = this.height * -1;

	this.mouseChildren = false;
} ;

p.handleClick = function (event) {
	alert("You clicked on a button: "+this.label);
} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == ("rollover") ? 0.4 : 1;
};

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Question = createjs.promote(Question, "Container");
}());