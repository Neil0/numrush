// enum test
var test = {
	ONE: 1, 
	TWO: 2,
	THREE: 3
}

function tester() {
	console.log(test.THREE);
	// Note: if i used Object.freeze() i wouldn't be able to change this value
	test.THREE = "three";
	console.log(test.THREE);
}

(function() {

function Button(label, color) {
	this.Container_constructor(); // Basically: super();
	
	this.color = color;
	this.label = label;
	
	this.setup();
}
// Basically: ... Button extends Container ...  
var p = createjs.extend(Button, createjs.Container); 


p.setup = function() {
	var PADDING = 10;

	var text = new createjs.Text(this.label, "20px Arial", "#000");
	text.textBaseline = "top";
	text.textAlign = "center";
	
	var width = text.getMeasuredWidth()+30; // Assuming just some padding/margin
	var height = text.getMeasuredHeight() + PADDING*2;
	
	// Note: ALL cordinates are based off the container's cordinates

	// cordinates for the text to be drawn 
	text.x = width/2;
	text.y = PADDING;
	
	var background = new createjs.Shape();
	background.graphics.beginFill(this.color).drawRoundRect(0,0,width,height,10);
	
	// Note: this refers to the container
	this.addChild(background, text);  // Container class method
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.cursor = "pointer";

	// Container cordinates 
	this.x = 100;

	// Disable interaction with child (only interact as a whole)
	this.mouseChildren = false;

// I have no idea what this does - doesn't appear to be part of container?
	this.offset = Math.random()*10;
	this.count = 0;
} ;

p.handleClick = function (event) {
	alert("You clicked on a button: "+this.label);
} ;

p.handleRollOver = function(event) {       
	this.alpha = event.type == ("rollover") ? 0.4 : 1;
};

// Allows things out of scope to use this now (all of the above cannot be called directly)
window.Button = createjs.promote(Button, "Container");
}());

/*
    // DEMO CODE ...
    var stage = new createjs.Stage("canvas");
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);

    createjs.Tween.get(circle, { loop: true })
      .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
      .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
      .to({ alpha: 0, y: 225 }, 100)
      .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
      .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage); // hm?
    // ... END DEMO

*/