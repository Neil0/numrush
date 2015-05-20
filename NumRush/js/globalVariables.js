// Global Variables 
var layout = {
	// ! : if you see 1111, it means that it's waiting for the device size 
	STAGE_WIDTH : 1111, 
	STAGE_HEIGHT : 1111,

	// POSITIONING 
	TOP1 : 1111,			// H 0 	
	TOP2 : 1111,			// H 10%
	MID1 : 1111,			// H 20%
	MID2 : 1111,			// H 35%
	MID3 : 1111,			// H 50%
	BOT1 : 1111,			// H 75%
	BOT2 : 1111,			// H 80&

	ALWAYSUSECOMMAS : 6969 // Basically so you can re-arrange variables without fear of putting commas down
}

var properties = {
	MARGIN : 10, // Unused
	PADDING : 10,  // Unused
	// Global font
	FONT : "Augusta",
	// Score or back button bar
	TOP1_WIDTH : 1111,		// W 100%
	TOP1_HEIGHT : 1111,		// H 10%
	// Lives or in/correct indicator bar
	TOP2_WIDTH : 1111,		// W 100%
	TOP2_HEIGHT : 1111,		// H 10%
	// Question bars 
	QUES_WIDTH : 1111,		// W 100%
	QUES_HEIGHT : 1111,		// H 15|25%
	QUES_COLOR : "#F00",
	// Timer or pretty bar
	BOT1_WIDTH : 1111,		// W 100%
	BOT1_HEIGHT : 1111,		// H 5%
	// Answer bar 
	ANS_SIZE : 1111,		// W 20%
	ANS_COLOR : "#0FF",	
}

var achieve = {
	// You Snooze, you lose
	YOUSNOOZEYOULOSE_SRC : "",
	YOUSNOOZEYOULOSE_DESCR : "First game lost.",
	// Hot Streak
	HOTSTREAK_SRC : "",
	HOTSTREAK_DESCR : "Get 15 questions right consecutively.",
	// First blood
	FIRSTBLOOD_SRC : "",
	FIRSTBLOOD_DESCR : "Get your first question right!",
	// Rocky
	ROCKY_SRC : "",
	ROCKY_DESCR : "Try practice mode for the first time.",

	ALWAYSUSECOMMAS : 6969 // Basically so you can re-arrange variables without fear of putting commas down
}

function initializeVariables(canvasWidth, canvasHeight) {
	// STAGE
	layout.STAGE_WIDTH = canvasWidth;
	layout.STAGE_HEIGHT = canvasHeight;
	// PROPERTIES
	properties.TOP1_WIDTH = canvasWidth * 1.00;		
	properties.TOP1_HEIGHT = canvasHeight * 0.10;		
	properties.TOP2_WIDTH = canvasWidth * 1.00;		
	properties.TOP2_HEIGHT = canvasHeight * 0.10;		
	properties.QUES_WIDTH = canvasWidth * 1.00;		
	properties.QUES_HEIGHT = canvasHeight * 0.15;		
	properties.BOT1_WIDTH = canvasWidth * 1.00;		
	properties.BOT1_HEIGHT = canvasHeight * 0.05;		
	properties.ANS_SIZE = canvasWidth * 0.20;		
	// POSITIONING 
	layout.TOP1 = canvasHeight * 0;			
	layout.TOP2 = canvasHeight * 0.10;			
	layout.MID1 = canvasHeight * 0.20;			
	layout.MID2 = canvasHeight * 0.35;			
	layout.MID3 = canvasHeight * 0.50;			
	layout.BOT1 = canvasHeight * 0.75;			
	layout.BOT2 = canvasHeight * 0.80;			
}
