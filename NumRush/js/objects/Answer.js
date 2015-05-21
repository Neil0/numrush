(function() {

function Answer(answer) {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = properties.ANS_SIZE;
	this.height = properties.ANS_SIZE;
	this.index; // Set by the game when loaded into the array

	// Answer
	this.answer = answer;
	this.available = true; // Determines if this answer is associated with a question already

	// When the answer fades away
	this.animateGone = function() {
	    createjs.Tween.get(this)
	        .to({ alpha: 0, scaleX: 0.6, scaleY: 0.6}, 200, createjs.Ease.linear)
	        .call( function() { this.visible = false });
	}

	// When a new answer appears
	this.animateNew = function() {
	    this.alpha = 0;       // Start invisible
	    this.scaleX = 1.2;    // Start large
	    this.scaleY = 1.2;
	    createjs.Tween.get(this)
	        .to({}, 100, createjs.Ease.linear)
	        .to({ alpha: 1, scaleX: 1, scaleY: 1 }, 300, createjs.Ease.linear);
	}

	this.setup();
}
var p = createjs.extend(Answer, createjs.Container); 


p.setup = function() {
	var fontSize = this.height * 0.40;
	var font = fontSize + "px " + properties.FONT; // TODO: make a global font
	var text = new createjs.Text(this.answer, font, "#000");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.height/2;
	
	var imageFile = preload.getResult("ans");
	var scaleFactor = this.width / imageFile.width; 
	var background = new createjs.Bitmap(imageFile);
	background.scaleX = background.scaleY = scaleFactor;

	// Note: this refers to the container
	this.addChild(background, text);  // Container class method
	this.on("click", this.handleClick);
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

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Answer = createjs.promote(Answer, "Container");
}());