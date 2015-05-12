(function() {

// TODO:Should color be a param?
function Question(num1, operator, num2, answer) {
	this.Container_constructor(); // Basically: super();
	
	// Positioning
	this.width = layout.QUES_WIDTH;
	this.height = layout.QUES_HEIGHT;
	this.color = layout.QUES_COLOR;

	// Question
    this.num1 = num1;
    this.operator = operator;
    this.num2 = num2;
	this.answer = answer;

	this.getQuestion = function() {
        return this.num1 + " " + this.operator + " " + this.num2;
    }

	this.label = this.getQuestion();

	this.setup();
}
// Basically: ... Button extends Container ...  
var p = createjs.extend(Question, createjs.Container); 


p.setup = function() {
	var text = new createjs.Text(this.label, "20px Arial", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
	
	// cordinates for the text to be drawn 
	text.x = this.width/2; // x is not top-left but the center
	text.y = layout.PADDING;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(this.color).drawRoundRect(0,0,this.width,this.height,10);
	
	console.log("width: " + this.width);
	console.log("height: " + this.height);

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