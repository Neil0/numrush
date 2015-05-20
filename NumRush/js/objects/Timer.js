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
	var font = fontSize + "px Augusta"; // TODO: make a global font
	var text = new createjs.Text("20.00", font, "#000");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.height/2;
	
	// Note: this refers to the container
	this.txt = this.addChild(text);  // Container class method

	// Container initial cordinates 
	this.x = 0;
	this.y = layout.BOT1;

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;
} ;

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Timer = createjs.promote(Timer, "Container");
}());