var TIME_REMAINING = 30;
secondsPassed();
function secondsPassed(){
	var start = new Date().getTime();
	var zero = '0.0';
	//runs every 1000 milliseconds
	window.setInterval(function go(){
	var time = new Date().getTime() - start;
	var timepassed = Math.floor(time / 1000) / 10;
	if(Math.round(zero) == zero){
		zero += '.0'
	}
	//test is the id of the timer
	document.getElementById('test').innerHTML = TIME_REMAINING;
	TIME_REMAINING--;
	}, 1000);
}

//variable to hold the user's score
var SCORE = 0;
//use this function when question is correct
function score(){
	var BasicGain = 100;
	SCORE +=(TIME_REMAINING * 10) + BasicGain;
	document.getElementById('score').innerHTML = SCORE;
}

