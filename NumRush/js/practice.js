$(document).ready(function() {    
    // -- FIELDS --
    var questions = []; // Will store the question objects
    var jQuestions = $('#question-bar div'); // td on the html page to put that actual information
    var $questionBar = $('#question-bar');
    var answers = []; // Mot using this right now b/c i'm a lazy fuq
    var jAnswers = $('#answer-bar div'); // td on the html page to put the answers in. 

    var correct = 0;    
    // Note: Sorry for the new variable naming, jquery objects should be named with $ prefix wihle normal variables don't. i'll change the rest later
    var $correctIndicator = $('#correct-indicator'); 
    var incorrect = 0;
    var $incorrectIndicator = $('#incorrect-indicator');

    // Audio
    var $correctSfx = $('#right-sfx');   
    var $gameBgm = $('#game-bgm');
    var sfxEnabled = true;


    // -- INIT -- 
    // Create the 5 answers
    initializeAnswers();
    // Create the 3 questions
    prepareNextQuestion();
    prepareNextQuestion();
    prepareNextQuestion();
    // Injection into the DOM
    initializeQuestions();

    // Attach handlers
    jAnswers.bind("tap", answerHandler);

    // Load audio
    loadSfxSound(); // Checks if the sfx should be played - doesn't actually load anything
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

        var test = questions[0].answer;

        // Check user choice
        // If correct 
        if ($targetElement.text() == questions[0].answer) {
            // Increase indicator count
            correct++;
            $correctIndicator.text("CORRECT: " + correct);

            // Play the sound
            if (sfxEnabled) { correctSfx(); }

            // Get a new number
            $targetElement.text(generateNextAnswer());
/*            
            if animated can't prepare next answer
            $targetElement.fadeOut(100, function() {
                $targetElement.text(generateNextAnswer());
            });
            $targetElement.fadeIn(100);*/

            // Reset the availability
            $targetElement.toggleClass("available");

            // Set up the next question internally
            prepareNextQuestion();

            // load the changes (with animations)
            animateNextQuestion();

        // else incorrect
        } else {
            // Increase indicator count
            incorrect++;
            $incorrectIndicator.text("INCORRECT: " + incorrect);
			if(sfxEnabled){
				incorrectSfx();
			}

            // Do nothing
        }
    }


    // -- METHODS --
    function animateNextQuestion() {
        // Retrieve necessary elements
        var $last = $('#question-bar div:last-child');
        var $nextBig = $('#question-bar div:nth-child(2)'); // Next quesiton to be answered

        // Create the new question (externally)
        var $newDiv = jQuery('<div>', {
            text: questions[2].toString(),
            style: 
                "display: none;"
        });

        $questionBar.prepend($newDiv) // Inject next answer in DOM
        $newDiv.slideDown('fast') // Animate it
        $nextBig.animate( { fontSize: "2.5em" }, 'fast'); // Animate the next question for answer
                          $last.fadeOut('fast').remove(); // Animate the answered question
    }


    // TODO: Load the audio, apparently audio lags
    function correctSfx() {
        var sfx = new Audio("sound/hitsound1.wav"); // buffers automatically when created
        sfx.play();
    }
	function incorrectSfx(){
		var sfx = new Audio("sound/miss.mp3");
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

    function loadSfxSound() {
        if (localStorage.getItem("sfx-muted") == "true") {
            sfxEnabled = false;
        } else {
            sfxEnabled = true;
        }
    }
	
	function buttonSound() {
		var sound = new Audio("sound/hitsound2.wav");
		sound.play();
	}

    // Gets and loads the first 5 answers
    function initializeAnswers() {
        for (i = 0; i < 5; i++) {
            jAnswers[i].innerHTML = generateNextAnswer();
        }
    }

    function initializeQuestions() {

        for (i=0; i<3; i++) {
            var $newDiv = jQuery('<div>', {
                text: questions[i].toString()
            });

            $questionBar.prepend($newDiv);
        }

        $('#question-bar div:last-child').css('font-size', '2.5em');

    }

    function advanceRows(newQuestion) {        
        // Move all objects up one position (overwritting the first)
        questions[0] = questions[1];
        questions[1] = questions[2];
        questions[2] = newQuestion
  }

    function loadAnswers() {
        for (i=0; i<5; i++) {
            jAnswers[i].innerHTML = answers[i];
        }
    }

    function loadQuestions() {

        // Divs should have the right value off the bat...

        console.log('asdfasdf');
        var $first = $('#container div:first-child');
        var $last = $('#container div:last-child');
        var $news = jQuery('<div>', {
            text: "Foobar",
            style: 
                "display: none;"
        });
        $news.insertBefore($first).show('fast');
                      $last.fadeOut('fast').remove();


        // Done in reverse order, index 0 = bottom row
        for (i=0; i<3; i++) {
            jQuestions[i].innerHTML = questions[2 - i].toString();
        }
    }
       
    function generateNextAnswer() {
        jAnswers = $('#answer-bar div'); // Retrieve the newest values
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

        //  the next question
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
		while(answer <= numA){
			numA = getRandomInt(1, 10);
		}
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


    var stageWidth = $('#canvas').attr("width");
    var stageHeight = $('#canvas').attr("height");

    var MARGIN = 10;
    var QUES_WIDTH ;
    var QUES_HEIGHT ;
    var QUES_COLOR = "#F00";
    var ANS_SIZE ;
    var ANS_COLOR = "#0FF";

// CreateJS
function init() {
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

    
    // START NEW
    stage.enableMouseOver();

    var stageWidth = $('#canvas').attr("width");
    var stageHeight = $('#canvas').attr("height");

    MARGIN = 10;
    QUES_WIDTH = stageWidth;
    QUES_HEIGHT = stageHeight * 0.10;
    QUES_COLOR = "#F00";
    ANS_SIZE = stageWidth * 0.2;
    ANS_COLOR = "#0FF";
       
    // Questions 
    var question1 = stage.addChild(new Question(5, "+", 2, 7));
    question1.y = MARGIN;
    question1.num2 = 234;
    console.log(question1.getQuestion());
    question1.label = question1.getQuestion();
    question1.setup
            
    var question2 = stage.addChild(new Question(5, "+", 2, 7));
    question2.y = question1.y + question1.height + MARGIN;
            
    var question3 = stage.addChild(new Question(5, "+", 2, 7));
    question3.y = question2.y + question2.height + MARGIN;

    // Answers
    var answer1 = stage.addChild(new Answer(10));
    answer1.x = 0;
    answer1.y = question3.y + question3.height + MARGIN;
            
    var answer2 = stage.addChild(new Answer(20));
    answer2.x = stageWidth * 0.2;
    answer2.y = question3.y + question3.height + MARGIN;
            
    var answer3 = stage.addChild(new Answer(5));
    answer3.x = stageWidth * 0.4; 
    answer3.y = question3.y + question3.height + MARGIN;

    var answer4 = stage.addChild(new Answer(2));
    answer4.x = stageWidth * 0.6;
    answer4.y = question3.y + question3.height + MARGIN;
            
    var answer5 = stage.addChild(new Answer(69));
    answer5.x = stageWidth * 0.8;
    answer5.y = question3.y + question3.height + MARGIN;


    createjs.Ticker.on("tick", stage); // Updates the stage


    var container = new createjs.Container();
}

