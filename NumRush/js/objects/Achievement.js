(function() {

function Achievement(imageSource, description) {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = properties.TOP1_WIDTH;
	this.height = properties.TOP1_HEIGHT;

	this.source = imageSource;
	this.description = description;
	this.txt;
	this.imageFile = new Image(this.source);
	imageFile.onload( function() {
		this.setup()
	});
	
	// Fade in, wait, then out
	this.animateAchievement = function() {
	    createjs.Tween.get(this)
	        .to({ alpha: 0.80}, 300, createjs.Ease.linear)
	        .to({}, 300, createjs.Ease.linear)
	        .to({ alpha: 0}, 300, createjs.Ease.linear)
	        .call( function() { this.visible = false; });	
	}

	// Might want to call animate after constructing 

}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(Achievement, createjs.Container); 


p.setup = function() {
	var fontSize = this.height * 0.40;
	var font = fontSize + "px " + properties.FONT; // TODO: make a global font
	var text = new createjs.Text(this.description, font, "#FFF");
	text.textBaseline = "middle";
	text.textAlign = "center";
		
	// cordinates for the text to be drawn 
	text.x = this.width/2;
	text.y = this.height/2;

	// Achievement icon
	var imageFile = new Image(this.source);
	var background = new createjs.Bitmap(imageFile);
	setScaleFactor(imageFile, this.width, this.height);
	
	// Note: this refers to the container
	this.txt = this.addChild(text);  // Container class method

	// Registration point
	this.regX = this.width / 2;
	this.regY = this.height / 2;
	// Container initial cordinates 
	this.x = layout.STAGE_WIDTH / 2;
	this.y = layout.TOP2;

	// Start hidden
	this.alpha = 0; 

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;
} ;

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Achievement = createjs.promote(Achievement, "Container");
}());