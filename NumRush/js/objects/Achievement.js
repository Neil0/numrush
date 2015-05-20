(function() {

function Achievement(imageSource, description) {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = layout.TOP1_WIDTH;
	this.height = layout.TOP1_HEIGHT;
	this.color = "orange";

	this.txt; 	
	
	this.setup();
}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(Achievement, createjs.Container); 


p.setup = function() {
	var fontSize = this.height * 0.40;
	var font = fontSize + "px Arial"; // TODO: make a global font
	var text = new createjs.Text("0", font, "#FFF");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.height/2;
	
	// Note: this refers to the container
	this.txt = this.addChild(text);  // Container class method

	// Registration point
	this.regX = this.width / 2;
	this.regY = this.height / 2;
	// Container initial cordinates 
	this.x = layout.STAGE_WIDTH / 2;
	this.y = layout.TOP2;

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;
} ;

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Achievement = createjs.promote(Achievement, "Container");
}());