(function() {

function correctIndicator() {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = layout.TOP2_WIDTH * 0.50;
	this.height = layout.TOP2_HEIGHT;
	this.color = "#0FF";

	this.label = "0";

	this.txt; // The displayObject
	
	this.setup();
}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(correctIndicator, createjs.Container); 


p.setup = function() {
	var text = new createjs.Text(this.label, "20px Arial", "green");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.height/2;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(this.color).drawRoundRect(0,0,this.width,this.height,10);
	
	// Note: this refers to the container
	this.txt = this.addChild(background, text);  // Container class method
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	// Container initial cordinates 
	this.x = 0;
	this.y = layout.TOP2;

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;
} ;

p.handleClick = function (event) {
	alert("why you clicking me");
} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == ("rollover") ? 0.4 : 1;
};

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.correctIndicator = createjs.promote(correctIndicator, "Container");
}());