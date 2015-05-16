(function() {

function Timer() {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = layout.BOT1_WIDTH;
	this.height = layout.BOT1_HEIGHT;
	this.color = "orange";

	this.txt; 	
	
	this.setup();
}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(Timer, createjs.Container); 


p.setup = function() {
	var fontSize = this.height * 0.40;
	var font = fontSize + "px Arial"; // TODO: make a global font
	var text = new createjs.Text("20.00", font, "#000");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.height/2;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(this.color).drawRoundRect(0,0,this.width,this.height,10);

/*	var timeFill = new createjs.Shape();
	timeFill.graphics.beginFill(this.color).drawRoundRect(0,0,)*/
	
	// Note: this refers to the container
	this.txt = this.addChild(background, text);  // Container class method
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
	alert("why you click on time?");
} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == ("rollover") ? 0.4 : 1;
};

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Timer = createjs.promote(Timer, "Container");
}());