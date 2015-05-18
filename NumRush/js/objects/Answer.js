(function() {

function Answer(answer) {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = layout.ANS_SIZE;
	this.height = layout.ANS_SIZE;
	this.color = layout.ANS_COLOR;
	this.index; // Set by the game when loaded into the array

	// Answer
	this.answer = answer;
	this.available = true; // Determines if this answer is associated with a question already

	this.setup();

	
}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(Answer, createjs.Container); 


p.setup = function() {
	var fontSize = this.height * 0.40;
	var font = fontSize + "px Arial"; // TODO: make a global font
	var text = new createjs.Text(this.answer, font, "#000");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.height/2;
	
	var imageFile = preload.getResult("ans");
	var scaleFactor = this.width / imageFile.width; 
	var background = new createjs.Bitmap(imageFile);
	background.scaleX = scaleFactor;
	background.scaleY = scaleFactor;

	// Note: this refers to the container
	this.addChild(background, text);  // Container class method
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	// Container initial cordinates 
	// Below 2 lines is so that scaling and rotation are based around the center
	this.regX = this.width / 2; 
	this.regY = this.height / 2;
	this.x = 1111;
	this.y = layout.BOT2 + (this.height / 2);

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;
} ;

p.handleClick = function (event) {
	/* Note: checkAnswer(), answerCorrect(), answerIncorrect() are all functions 
		defined in individual game modes (different for each mode)*/

	if (checkAnswer(this.answer)) {
		// Carry out the correct function (which can vary between game modes)
		answerCorrect(); 
	} else {
		// Carry out the incorrect function (which can vary between game modes)
		answerIncorrect();
	}
};

p.handleRollOver = function(event) {       
	this.alpha = event.type == ("rollover") ? 0.4 : 1;
};

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Answer = createjs.promote(Answer, "Container");
}());