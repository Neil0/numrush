$(document).ready(function() {    
    // -- FIELDS --
    var questions = []; // Will store the question objects
    var jQuestions = $('#question-table tr td'); // td on the html page to put that actual information
    var answers = []; // Mot using this right now b/c i'm a lazy fuq
    var jAnswers = $('#answer-table tr td'); // td on the html page to put the answers in. 

    var correct = 0;    
    // Note: Sorry for the new variable naming, jquery objects should be named with $ prefix wihle normal variables don't. i'll change the rest later
    var $correctIndicator = $('#correct-indicator'); 
    var incorrect = 0;
    var $incorrectIndicator = $('#incorrect-indicator');

    // Audio
    var $correctSfx = $('#right-sfx');   
    var $gameBgm = $('#game-bgm');


    // Initialization
    // Create the 5 answers
    initializeAnswers();
    // Create the 3 questions
    prepareNextQuestion();
    prepareNextQuestion();
    prepareNextQuestion();

    // Load them visually 
    loadQuestions();
    //loadAnswers();

    // Attach handlers
    jAnswers.bind("tap", answerHandler);

    // Load audio
    loadBgmSound();
  
    // -- OBJECTS --
    function Question(num1, operator, num2, answer) {
        this.num1 = num1;
        this.operator = operator;
        this.num2 = num2;
        this.answer = answer;
        this.toString = function() {
            return this.num1 + " " + this.operator + " " + this.num2;
        }
    }


    // -- HANDLERS --
    function answerHandler(event) {
        // Retrieve the selected element
        var $targetElement = $(event.target);

        // Check user choice
        // If correct 
        if ($targetElement.text() == questions[0].answer) {
            // Increase indicator count
            correct++;
            $correctIndicator.text("CORRECT: " + correct);

            // Play the sound
            correctSound();

            // Get a new number
            $targetElement.text(generateNextAnswer());
            // Reset the availability
            $targetElement.toggleClass("available");

            // Set up the next question internally
            prepareNextQuestion();

            // Load the changes (esentially repaint())
            loadQuestions();
            //loadAnswers();
        
        // else incorrect
        } else {
            // Increase indicator count
            incorrect++;
            $incorrectIndicator.text("INCORRECT: " + incorrect);

            // Do nothing
        }
    }


    // -- METHODS --

    function correctSound() {
        var sfx = new Audio("sound/hitsound1.wav"); // buffers automatically when created
        sfx.play();
    }

    function loadBgmSound() {
        var bgm = new Audio("sound/game_bgm.wav");
        bgm.loop = true;

        if (localStorage.getItem("bgm-muted") == "true") {
            bgm.pause();
        } else {
            bgm.play();
        }
    }

    // Gets and loads the first 5 answers
    function initializeAnswers() {
        for (i = 0; i < 5; i++) {
            jAnswers[i].innerHTML = generateNextAnswer();
        }
    }

    function advanceRows(newQuestion) {        
        // Move all objects up one position (overwritting the first)
        questions[0] = questions[1];
        questions[1] = questions[2];
        questions[2] = newQuestion;
    }

    function loadAnswers() {
        for (i=0; i<5; i++) {
            jAnswers[i].innerHTML = answers[i];
        }
    }

    function loadQuestions() {
        // Done in reverse order, index 0 = bottom row
        for (i=0; i<3; i++) {
            jQuestions[i].innerHTML = questions[2 - i].toString();
        }
    }
       
    function generateNextAnswer() {
        jAnswers = $('#answer-table tr td');
        var randInt;
        // Loop until there is no overlap
        outer:
        while (true) {
            // Get the new value
            randInt = getRandomInt(1, 20);

            // Check if it exists already
            // Note: ... what the fuck, this can't be i because it changes the outer loop....
            // Note: for loop is a loop, so you need a label to continue the while
            for (j = 0; j < jAnswers.length - 1; j++) {
                var something = jAnswers[j].innerHTML;
                if (something == randInt) {
                    continue outer; // Yes - retry
                } 
            }
            // No - return the value
            break;
        }

        return randInt;
    } 

    function prepareNextQuestion() {
        // Obtain information about the current board
        var availableArray = $('.available');

        // Hacky: Select one of the avaiable numbers
        availableArray[getRandomInt(0, availableArray.length - 1)].id = "selected-element";
        var selectedElement = $('#selected-element');

        // Retrieve the answer
        var answer = parseInt(selectedElement.text());
        // Toggle availibility off
        selectedElement.toggleClass('available');
        // Remove the id (selection)
        selectedElement.removeAttr('id');

        // Create the next question
        var nextQuestion = generateNextQuestion(answer);

        // Advance the questions forward, while adding in the new one
        advanceRows(nextQuestion);
    }

    function generateNextQuestion(answer) {
 
        var question; 
    
        var randNum = getRandomInt(1, 2);
        switch (randNum) {
            case 1: 
                question = generateSum(answer);
                break;
            case 2:
                question = generateMinus(answer);
                break;
            case 3:
                question = generateMultiplication(answer);
                break;
            case 4:
                question = generateDivision(answer);
                break;
            default: 
                console.log("something went wrong");
                break;
        }
        
        return question;
    }
    
    function generateSum(answer) {
        var numA = getRandomInt(1, 10);
        // using numbers between 1 and 10 for now
        var numB = answer - numA;
        var question = new Question(numA, "+", numB, answer);
        return question;
    }
    function generateMinus(answer){
        do {
            // Has to be 21 or it might loop infintely 
            numA = getRandomInt(1, 21);
        } while (numA <= answer) 

        var numB = numA - answer;
        var question = new Question(numA, "-", numB, answer);
        return question;
    }
    function generateMultiplication(answer){
        var numA = getRandomInt(1, 10);
        //Not sure how to make this work since we will need to divide the answer by a random number to get a second number.
        while((answer % numA) != 0 && answer > numA){ // will fuck up if numA is too big.
        numA++;
        }
        var numB = answer / numA;
        var Question = new Question(numA, "*", numB, answer);
        return Question;
    }
    function generateDivision(answer){
        var numA = getRandomInt(1, 10);
        var numB = answer * numA;
        var Question = new Question(numA, "/", numB, answer);
        return Question;
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