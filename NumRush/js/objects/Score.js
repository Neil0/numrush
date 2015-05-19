(function() {

function Score() {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = layout.TOP1_WIDTH;
	this.height = layout.TOP1_HEIGHT;
	this.color = "orange";

	this.txt; 	
	
	this.setup();
}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(Score, createjs.Container); 


p.setup = function() {
	var fontSize = this.height * 0.40;
	var font = fontSize + "px Arial"; // TODO: make a global font
	var text = new createjs.Text("0", font, "#FFF");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.height/2;
	
	// Retrieve file
	var scoreBackFile = preload.getResult("scoreBack");
	var background = new createjs.Bitmap(scoreBackFile);
	setScaleFactor(background, this.width, this.height);
	
	// Note: this refers to the container
	this.txt = this.addChild(background, text);  // Container class method
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	// Container initial cordinates 
	this.x = 0;
	this.y = layout.TOP1;

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
window.Score = createjs.promote(Score, "Container");
}());