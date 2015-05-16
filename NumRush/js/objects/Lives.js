(function() {

function Lives() {
	this.Container_constructor(); // Basically: super();
	
	// Layout
	this.width = layout.TOP2_WIDTH;
	this.height = layout.TOP2_HEIGHT;
	this.color = "brown";

	this.lifeArray = [];
	this.nolifeArray = [];

	this.updateLivesDisplay = function(life) {
		// Assuming game restart
		if (life == 5) {
			for (all = 0; all < 5; all++) {
				this.lifeArray[all].visible = true;
				this.nolifeArray[all].visible = false;
			}
			return;
		}
		
		// Get the desired display object
		var removeLife = this.lifeArray[life];
		var addNolife = this.nolifeArray[life];

		// TODO:Animate them
		removeLife.visible = false;
		addNolife.visible = true;
	} 
	
	this.setup();
	this.updateLivesDisplay(5);
}
// Basically: ... Button extends Container ...  (below returns a prototype)
var p = createjs.extend(Lives, createjs.Container); 


p.setup = function() {

	// Retrieve the files
	var lifeFile = preload.getResult("life");
	var nolifeFile = preload.getResult("nolife");
	// Calculate the scale factor 
	var scaleFactor = this.height / lifeFile.height; 
	lifeFile.scale = scaleFactor;	// Add new property scale, so we can reference it later

	// Create 5 of each
	// Note: Using hp b/c scared of variable collision 
	// Note: Only supports 5 lives
	for (hp = 0; hp < 5; hp++) {
		// Create bitmap object 
		var lifeBitmap = new createjs.Bitmap(lifeFile);
		var nolifeBitmap = new createjs.Bitmap(nolifeFile);
		// Fix scale (scale is an added property)
		lifeBitmap.scaleX = lifeBitmap.scaleY = lifeBitmap.scale = scaleFactor;
		nolifeBitmap.scaleX = nolifeBitmap.scaleY = nolifeBitmap.scale = scaleFactor;

		// Base scaling and rotation around the center
		lifeBitmap.regX = lifeBitmap.image.width / 2; 
		lifeBitmap.regY = lifeBitmap.image.height / 2;
		nolifeBitmap.regX = nolifeBitmap.image.width / 2; 
		nolifeBitmap.regY = nolifeBitmap.image.height / 2;

		// Set location
		lifeBitmap.x = this.width * ((hp+1)*(0.15) + 0.05);	
		lifeBitmap.y = this.height / 2;
		nolifeBitmap.x = this.width * ((hp+1)*(0.15) + 0.05);
		nolifeBitmap.y = this.height / 2;

		// Make nolife invisible for now
		nolifeBitmap.visible = false;

		// Add to parent (order is important);
		var lifeDisplayObject = this.addChild(lifeBitmap);
		var nolifeDisplayObject = this.addChild(nolifeBitmap);
		// Add to array to access later
		this.lifeArray.push(lifeDisplayObject);
		this.nolifeArray.push(nolifeDisplayObject);
	}

	// Note: this refers to the container
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
	alert("why you click on time?");
} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == ("rollover") ? 0.4 : 1;
};

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Lives = createjs.promote(Lives, "Container");
}());