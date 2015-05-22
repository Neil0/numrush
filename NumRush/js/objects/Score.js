(function() {

function Score() {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = properties.TOP1_WIDTH;
	this.height = properties.TOP1_HEIGHT;

	this.txt; 	
	
	this.setup();
}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(Score, createjs.Container); 


p.setup = function() {
	var fontSize = this.height * 0.40;
	var font = fontSize + "px " + properties.FONT; // TODO: make a global font
	var text = new createjs.Text("0", font, "#FFF");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.height/2;
	
	// Note: this refers to the container
	this.txt = this.addChild(text);  // Container class method

	// Container initial cordinates 
	this.x = 0;
	this.y = layout.TOP1;

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;
} ;

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Score = createjs.promote(Score, "Container");
}());