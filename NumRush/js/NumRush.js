// CORE FUNCTIONALITY
$(document).ready(function(){

	var row1 = [];
	var row2 = [];
	var row3 = [];
	var row4 = [];
	var rowNext = [];
	var allRows; // TODO: Multi-dimensional array 

	// Holds all information about solutions. Currently to check answer it just calculates, this is only used for row generation
	var solutions = []; // For initialization
	var solutionIndex = 2; // First two are initial operands

	var table = []; // Combination of all the row VALUES 

	// HTML DOM Objects 
	var cells = $('#game-cells td'); // not used
	var rows = $('#game-cells tr'); // not used
	var jRow1 = $('#game-cells tr:nth-child(1) td');
	var jRow2 = $('#game-cells tr:nth-child(2) td');
	var jRow3 = $('#game-cells tr:nth-child(3) td');
	var jRow4 = $('#game-cells tr:nth-child(4) td');

	var selectableRow = $('#selectable-row td');

	// Question bar
	var operand1 = $('#operand1');
	var opperator = $('#operator');
	var operand2 = $('#operand2');
	var leftSide = true;



	initializeQuestionBar();
	initializeCells();
	selectableRow.bind("tap", selectableHandler);



	// Handlers
	function selectableHandler(event) {
		// The jQuery object and not the JS
		var text = $(event.target).text();
		var sum = parseInt(operand1.text()) + parseInt(operand2.text());
		console.log("Target: " + text + " Sum: " + sum);

		if (text == sum) {
			generateNextSolution(); // Prepare next row w/ answer 
			advanceRows(); // Advance all the rows 
			loadRows(); // Repaint the screen

			// Change the correct operand
			if (leftSide) {
				operand1.text(sum);
				leftSide = false;
			} else {
				operand2.text(sum);
				leftSide = true;
			}

		}
	}

	function generateNextSolution() {
		// Add the last two solutions together 
		var nextSolution = solutions[solutions.length - 1] + solutions[solutions.length - 2];
		solutions.push(nextSolution);

		rowNext.push(solutions[solutions.length - 1]); // Add in the newest soltuion
		// Fill
		for (i=0; i<3; i++) {
			rowNext.push(getRandomInt(1, 10));
		}
		// Shuffle
		shuffle(rowNext);
	}

	function advanceRows() {
		// Note: Bottom up or you'll overwrite each row in the process
		// Note: Arrays must be cleared as there is no overwriting array - just adding on to the end
		row4 = []; 
		row4 = row3.slice();
		row3 = [];
		row3 = row2.slice();
		row2 = [];
		row2 = row1.slice();
		row1 = [];
		row1 = rowNext.slice();
		rowNext = [];
	}

	// Pretty much paint screen
	function loadRows() {
		for (i=0; i<4; i++) {
			jRow1[i].innerHTML = row1[i];
			jRow2[i].innerHTML = row2[i];
			jRow3[i].innerHTML = row3[i];
			jRow4[i].innerHTML = row4[i];
		}
	}

	// Needs to go before initialize cells
	function initializeQuestionBar() {
		// Fill in the bar 
		var num1 = getRandomInt(1, 10);
		var oper = "+";
		var num2 = getRandomInt(1, 10);

		operand1.text(num1);
		opperator.text(oper);
		operand2.text(num2);

		// Load the first two 'solutions'
		solutions[0] = num1;
		solutions[1] = num2;
	}

	function initializeCells() {
		generateNextSolution();
		advanceRows();

		generateNextSolution();
		advanceRows();

		generateNextSolution();
		advanceRows();

		generateNextSolution();
		advanceRows();

		loadRows();
	}


	// -- UTILITY -- 
	// random number between range - inclusive 
	function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Shuffle an array by Fisher-Yates	
	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex ;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}

});
