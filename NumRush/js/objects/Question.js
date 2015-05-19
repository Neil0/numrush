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

	// Display objects
	this.txt;
	this.bg;
	this.center;

	this.animate3rdPosition = function() {
  		createjs.Tween.get(this)
        	.to({ y:layout.MID1 }, 300, createjs.Ease.linear);  
	}
	this.animate2ndPosition = function() {
	    createjs.Tween.get(this)
	        .to({ y:(layout.MID2) }, 300, createjs.Ease.linear); 
	}
	this.animate1stPosition = function() {
	    createjs.Tween.get(this)
	        .to({ y:(layout.MID3), scaleY: 1.66 }, 300, createjs.Ease.linear); // Advance position
	  	createjs.Tween.get(this.center)
	  		.to({ scaleX: 1.66 }, 300, createjs.Ease.linear);	// Enlarge center image (scaleY taken care above)
	    createjs.Tween.get(this.txt)
	        .to({ scaleX: 1.66 }, 300, createjs.Ease.linear); // Enlarge text (scaleY taken care above)
	}
	this.animateGone = function() {
		createjs.Tween.get(this)
	        .to({ y:(layout.MID3 + this.height), alpha: 0 }, 300, createjs.Ease.linear)
	        .call( function() {
	            this.visible = false; 
	    });
	}

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
	// -- TEXT --
	var fontSize = this.height * 0.40;
    var font = fontSize + "px Arial"; // TODO: make a global font
	var text = new createjs.Text(this.label, "20px Arial", "#000");
	text.textBaseline = "middle";
	text.textAlign = "center";
	// cordinates for the text to be drawn 
	text.x = this.width/2; // x is not top-left but the center
	text.y = this.height/2;
	
	// -- QUESTION BG --
	// Load image background and get scale factors
	var quesBackFile = preload.getResult("quesBack");
	var xBackFactor = this.width / quesBackFile.width; 
	var yBackFactor = this.height / quesBackFile.height;
	// Create bitmap and resize
	var questionBack = new createjs.Bitmap(quesBackFile);
	questionBack.scaleX = xBackFactor;
	questionBack.scaleY = yBackFactor;

	// -- QUESTION CENTER -- 
	// Load image center and get scale factors
	var quesCenterFile = preload.getResult("quesCenter");
	var yCenterFactor = (this.height * 0.80) / quesCenterFile.height;
	var xCenterFactor = yCenterFactor;
	// Create bitmap 
	var questionCenter = new createjs.Bitmap(quesCenterFile);
	// Base scaling and rotation around center for CENTER image
	questionCenter.regX = questionCenter.image.width / 2;
	questionCenter.regY = questionCenter.image.height / 2;
	questionCenter.x = (this.width / 2);
	questionCenter.y = (this.height / 2);
	// Resize (after regXY)
	questionCenter.scaleX = xCenterFactor;
	questionCenter.scaleY = yCenterFactor;	


	// -- THIS (CONTAINER) -- 
	// Add to the container
	this.bg = this.addChild(questionBack);
	this.center = this.addChild(questionCenter);
	this.txt = this.addChild(text);  
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
	alert("You clicked on a button: "+ this.label);
} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == ("rollover") ? 0.4 : 1;
};

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Question = createjs.promote(Question, "Container");
}());