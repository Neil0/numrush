(function() {

function Achievement(image) {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = properties.TOP1_WIDTH * 0.80;
	this.height = properties.TOP1_HEIGHT;

	this.image = image;
	
	// Fade in, wait, then out
	this.animateAchievement = function() {
	    createjs.Tween.get(this)
	        .to({ alpha: 0.95}, 150, createjs.Ease.sineIn)
	        .to({}, 1000, createjs.Ease.linear)
	        .to({ alpha: 0}, 300, createjs.Ease.sineIn)
	        .call( function() { this.visible = false; });	
	}

	this.setup();
}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(Achievement, createjs.Container); 


p.setup = function() {
	// Achievement icon
	var background = new createjs.Bitmap(this.image);
	setEqualScaleFactor(background, true, this.width);
	
	this.addChild(background);  // Container class method

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