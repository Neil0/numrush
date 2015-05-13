// EaselJS 
var canvas, stage;
var stageWidth, stageHeight; // This is technically jQuery

// GAME INFO
var questions = [];
var answers = [];
// Score
var BASE_GAIN = 100; // Minimum point gain on correct answer
var score = 0;
// Lives
var MAX_LIVES = 5;
var livesRemaining = MAX_LIVES;  
// Time
var MAX_TIME = 30000; // 30 Seconds
var remainingTime = MAX_TIME;
var startTime;

// DisplayObjects
var scoreDisplay;
var timerDisplay;
var livesDisplay;

var sfxEnabled; // Determined by loadSfx()


function init() {
    // Stage info
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(); // TODO: Remove this later (change with touch or something?)

    // Initialize global variables 
    stageWidth = $('#canvas').prop("width"); 
    stageHeight = $('#canvas').prop("height");

    initializeVariables(stageWidth, stageHeight);

    console.log(layout.QUES_WIDTH);
    console.log(480);

    // Audio
    // TODO: sfx and bgm

    // Initialization 
    // Timer stuff
    startTime = new Date().getTime();
    timerDisplay = stage.addChild(new Timer());
    // Score stuff
    scoreDisplay = stage.addChild(new Score());
    // Lives stuff
    livesDisplay = stage.addChild(new Lives());

    initializeAnswers();
    initializeQuestions(); 

    updateAnswerPositions();
    updateQuestionPositions();

    // Looper
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", stage); // Updates the stage
    createjs.Ticker.on("tick", updateTimeRemaining); // Updates the time remaining (with display)

    console.log(stage.children.length);
}


function updateTimeRemaining(){
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - startTime;
    // Update time left
    remainingTime = MAX_TIME - elapsedTime;

    // Check if question fail
    if (remainingTime < 0) {
        remainingTime = 0; // Might be unnecessary
        answerIncorrect();
    } else {
        // TODO: Nothing, or maybe something?
    }

    // Format to two decimal places (rounds too)
    var formattedTime = (remainingTime / 1000).toFixed(2);
    // Display the time left
    timerDisplay.txt.text = formattedTime;
}

//use this function when question is correct
function increaseScore(){
    score += Math.round(BASE_GAIN + (remainingTime / 100));
    // TODO: Update the score
    scoreDisplay.txt.text = score;
}


// AUDIO
function correctSfx() {
    var sfx = new Audio("sound/hitsound1.wav"); // buffers automatically when created
    sfx.play();
}

function incorrectSfx() {
    var sfx = new Audio("sound/miss.mp3");
    sfx.play();
}

function buttonSound() {
    var sound = new Audio("sound/hitsound2.wav");
    sound.play();
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

// INITIALIZERS
// TODO: Fix this once generateAnswers is done
function initializeAnswers() {
    for (i = 0; i < 5; i++) {
        var nextAnswer = generateNextAnswer();
        nextAnswer.index = i; // We need the index so we can replace them properly
        answers.push(nextAnswer);
    }
}

function initializeQuestions() {
    for (i = 0; i < 3; i++) {
        questions.push(generateNextQuestion());
    }
}


// GAME LOGIC
// Creates the next answer 
function generateNextAnswer() {
    var randInt;
    // Loop until there is no overlap
    outer:
        while (true) {
            // Get the new value
            randInt = getRandomInt(1, 20);

            // Check if it exists already
            for (j = 0; j < answers.length; j++) {
                var something = answers[j].answer;
                if (something == randInt) {
                    continue outer; // Yes - retry
                }
            }
            // No - return the value
            break;
        }
    
    // Answerobject, stage.addChild - return DisplayObject 
    return stage.addChild(new Answer(randInt));
}

// Gathers are all the necessary info before generating the next answer
function prepareNextQuestion() {
    // Obtain information about the current board
    var availableArray = [];
    // Note: foreach loop not working very well
    for (a=0; a<answers.length; a++) {
        if (answers[a].available == true) {
            availableArray.push(answers[a]);
        }
    }

    // Select one of the avaiable numbers
    var randAvailable = availableArray[getRandomInt(0, availableArray.length - 1)];
    // Toggle availibility off
    randAvailable.available = false;
    // Retrieve the answer
    return randAvailable.answer;
}

function generateNextQuestion() {

    var answer = prepareNextQuestion();

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
            console.log("something went wrong with generateNextQuestion()");
            break;
    }

    // Return the display object 
    return stage.addChild(question);
}

function generateSum(answer) {
    var numA = getRandomInt(1, 10);
    // using numbers between 1 and 10 for now
    while (answer <= numA) {
        numA = getRandomInt(1, 10);
    }
    var numB = answer - numA;
    var question = new Question(numA, "+", numB, answer);
    return question;
}
function generateMinus(answer) {
    do {
        // Has to be 21 or it might loop infintely 
        numA = getRandomInt(1, 21);
    } while (numA <= answer)

    var numB = numA - answer;
    var question = new Question(numA, "-", numB, answer);
    return question;
}
function generateMultiplication(answer) {
    var numA = getRandomInt(1, 10);
    //Not sure how to make this work since we will need to divide the answer by a random number to get a second number.
    while ((answer % numA) != 0 && answer > numA) { // will fuck up if numA is too big.
        numA++;
    }
    var numB = answer / numA;
    var Question = new Question(numA, "*", numB, answer);
    return Question;
}
function generateDivision(answer) {
    var numA = getRandomInt(1, 10);
    var numB = answer * numA;
    var Question = new Question(numA, "/", numB, answer);
    return Question;
}

// Move all objects up one position (overwritting the first)
function advanceRows(newQuestion) {
    // Animation
    // Individually animate each one
    createjs.Tween.get(questions[0])
        .to({ y:(questions[0].y + 150), alpha: 0 }, 300, createjs.Ease.linear)
        .call( function() {
            this.visible = false; 
        });

    createjs.Tween.get(questions[1])
        .to({ y:(questions[1].y + 150) }, 300, createjs.Ease.linear); // Advance position
    createjs.Tween.get(questions[1].getChildAt(1))
        .to({ scaleX: 2, scaleY: 2 }, 300, createjs.Ease.linear); // Enlarge text

    createjs.Tween.get(questions[2])
        .to({ y:(questions[2].y + 150) }, 300, createjs.Ease.linear); 

    createjs.Tween.get(newQuestion)
        .to({ y:layout.MID1}, 300, createjs.Ease.linear);  

    questions[0] = questions[1];
    questions[1] = questions[2];
    questions[2] = newQuestion
}

// Answer checking
function checkAnswer(answer) {
    return (answer == questions[0].answer);
}

function answerCorrect(parentIndex, parentX) {
    // Update the score
    increaseScore();
    // Reset the time
    remainingTime = MAX_TIME;

    // Create the next answer 
    var nextAnswer = generateNextAnswer();
    nextAnswer.index = parentIndex;         // Pass on parent index
    nextAnswer.x = parentX;                 // Pass on parent position
    answers[nextAnswer.index] = nextAnswer; // Replace parent

    // Animate next answer
    nextAnswer.alpha = 0;
    nextAnswer.scaleX = 1.2;
    nextAnswer.scaleY = 1.2;
    createjs.Tween.get(nextAnswer)
        .to({}, 100, createjs.Ease.linear)
        .to({ alpha: 1, scaleX: 1, scaleY: 1 }, 300, createjs.Ease.linear);

    // Create the next question
    advanceRows(generateNextQuestion());
}

function answerIncorrect() {
    // TODO: Finish logic
    livesRemaining--;
    livesDisplay.txt.text = livesRemaining;

    if (livesRemaining <= 0) {
        alert("You board the 125. STRAIGHT TO HELLLLLLLL");
    }
}

// POSITIONING
function updateQuestionPositions() {
    for (q=0; q<3; q++) {
        switch (q) {
            case 0:
                questions[q].y = layout.MID3; // Lowest
                break;
            case 1: 
                questions[q].y = layout.MID2; 
                break;
            case 2: 
                questions[q].y = layout.MID1; // Most upper
                break;
            default: 
                console.log("Something went wrong with loadQuestions()");
                break;
        } 
        console.log("Ques x: " + questions[q].x + " y: " + questions[q].y );
    }
}

function updateAnswerPositions() {
    for (a = 0; a < 5; a++) {
        // x and y of the CENTER of the container. (not top left)
        answers[a].x = (layout.ANS_SIZE / 2) + (a)*(layout.ANS_SIZE);

        console.log("Ans x: " + answers[a].x + " y: " + answers[a].y);
    }
}