// Global Variables 
var layout = {
	// ! : if you see 1111, it means that it's waiting for the device size 

	STAGE_WIDTH : 1111, 
	STAGE_HEIGHT : 1111,

	// Component properties  
	QUES_WIDTH : 1111,
	QUES_HEIGHT : 1111,
	QUES_COLOR : "#F00",
	
	ANS_SIZE : 1111,
	ANS_COLOR : "#0FF",

	// Positioning 
	MARGIN : 10, // Unused
	PADDING : 10,  // Unused

	TOP1 : 0,
	TOP2 : 75,
	MID1 : 150,
	MID2 : 300,
	MID3 : 450,
	BOT1 : 600,
	BOT2 : 650,

	ALWAYSUSECOMMAS : 6969 // Basically so you can re-arrange variables without fear of putting commas down
}

function initializeVariables(deviceWidth, deviceHeight) {
	layout.STAGE_WIDTH = deviceWidth;
	layout.STAGE_HEIGHT = deviceHeight;

	layout.QUES_WIDTH = deviceWidth;
	layout.QUES_HEIGHT = deviceHeight * 0.15;

	layout.ANS_SIZE = deviceWidth * 0.20;
}
