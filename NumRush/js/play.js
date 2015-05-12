// EaselJS 
var canvas, stage;
var stageWidth, stageHeight; // This is technically jQuery

// Game Info
var questions = [];
var answers = [];

var timer;

var correct = 0;
var incorrect = 0;
var correctIndicator, incorrectIndicator;

var currentAnswer; // The current answer for the game 
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
    // TODO: remove addchild
    initializeAnswers();
    initializeQuestions(); 
    correctIndicator = stage.addChild(new correctIndicator());
    incorrectIndicator = stage.addChild(new incorrectIndicator());

    // timer stuff
    timer = stage.addChild(new Timer());

    updateAnswerPositions();
    updateQuestionPositions();

    // Looper
    createjs.Ticker.setFPS(60);
    createjs.Ticker.on("tick", stage); // Updates the stage

    console.log(stage.children.length);
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

function advanceRows(newQuestion) {
    // Move all objects up one position (overwritting the first)


// i need to save the variable before, because they're being advanced while the tween is running
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
    for (a=0; a<5; a++) {
        switch(a) {
            case 0:
                answers[a].x = 0;
                break;
            case 1:
                answers[a].x = stageWidth * 0.20;
                break;
            case 2:
                answers[a].x = stageWidth * 0.40;
                break;
            case 3:
                answers[a].x = stageWidth * 0.60;
                break;
            case 4:
                answers[a].x = stageWidth * 0.80;
                break;
            default:
                console.log("Something went wrong with loadAnswers()");
                break;
        }
        console.log("Ans x: " + answers[a].x + " y: " + answers[a].y );
    }

}