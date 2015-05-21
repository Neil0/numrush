(function() {

function CorrectIndicator() {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = properties.TOP2_WIDTH * 0.50;
	this.height = properties.TOP2_HEIGHT;

	this.label = "0";

	this.txt; // The displayObject
	
	this.setup();
}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(CorrectIndicator, createjs.Container); 


p.setup = function() {
	var fontSize = this.height * 0.40;
	var font = fontSize + "px " + properties.FONT; // TODO: make a global font
	var text = new createjs.Text(this.label, font, "green");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/1.6;	// Haha, this is real
	text.y = this.height/2;
	
	// Note: this refers to the container
	this.txt = this.addChild(text);  // Container class method

	// Container initial cordinates 
	this.x = 0;
	this.y = layout.TOP2;

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;
} ;

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.CorrectIndicator = createjs.promote(CorrectIndicator, "Container");
}());