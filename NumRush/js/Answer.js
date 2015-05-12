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
	var text = new createjs.Text(this.answer, "20px Arial", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.width/2;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(this.color).drawRoundRect(0,0,this.width,this.height,10);
	
	// Note: this refers to the container
	this.addChild(background, text);  // Container class method
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	// Container initial cordinates 
	this.x = 0;
	this.y = layout.BOT1;

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;
} ;

p.handleClick = function (event) {
	if (this.answer == questions[0].answer) {
		// Scores
		correct++;

		// Current componenets
		this.visible = false; 
		//questions[0].visible = false;

		// Create the next answer
		var nextAnswer = generateNextAnswer(); 
		nextAnswer.index = this.index; // Pass on this index 
		answers[nextAnswer.index] = nextAnswer; // Replace this answer with new
		// Create the next question
		advanceRows(generateNextQuestion());
	} else {
		incorrect++;
	}

	//updateQuestionPositions();
	updateAnswerPositions();
} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == ("rollover") ? 0.4 : 1;
};

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Answer = createjs.promote(Answer, "Container");
}());