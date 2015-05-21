(function() {

function Button(imageKey) {
	this.Container_constructor(); // Basically: super();
		
	this.width = properties.TOP1_WIDTH;
	this.height = properties.TOP1_HEIGHT;
	this.imageKey = imageKey;

	this.setup();
}
// Basically: ... Button extends Container ...  
var p = createjs.extend(Button, createjs.Container); 


p.setup = function() {
	var imageFile = preload.getResult(this.imageKey);		
	var theBitmap = new createjs.Bitmap(imageFile);
	setEqualScaleFactor(theBitmap, false, this.height);

	// Note: this refers to the container
	this.bitmap = this.addChild(theBitmap);  // Container class method
	this.on("click", this.handleClick);
	this.cursor = "pointer";

	// Container cordinates 
	this.x = 0;
	this.y = 0;

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;
} ;

p.handleClick = function (event) {
	document.location.href = "menu.html";
} ;

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Button = createjs.promote(Button, "Container");
}());