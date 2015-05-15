// EaselJS 
var canvas, stage;

// GAME INFO
var questions = [];
var answers = [];
var currentAnswer; // Note: This is an object, to access the answer value use currentAnswer.answer
// Score
var BASE_GAIN = 10; // Minimum point gain on correct answer
var score = 0;
// Lives
var MAX_LIVES = 5;
var livesRemaining = MAX_LIVES;  
// Time
var MAX_TIME = 20000; // 20 Seconds
var remainingTime = MAX_TIME;
var startTime;

// Layers
var foregroundLayer = new createjs.Container(); 
var backgroundLayer = new createjs.Container(); // Only contains questions
// DisplayObjects
var scoreDisplay;
var timerDisplay;
var livesDisplay;

var sfxEnabled; // Determined by loadSfx()


function init() {
    // Stage info
    canvas = document.getElementById("canvas"); 
    fullScreenCanvas(canvas);           // Sets width and height to fill screen
    stage = new createjs.Stage(canvas); // Creates a EaselJS Stage for drawing
    stage.addChild(backgroundLayer, foregroundLayer); // Add layers

    // Detection
    stage.enableMouseOver();    // TODO: Remove this later (change with touch or something?)

    // Initialize global variables for layout and sizing
    initializeVariables(canvas.width, canvas.height);

    console.log(layout.QUES_WIDTH);
    console.log(480);

    // Audio:
    // TODO: sfx and bgm

    // Initialization: 
    // Timer stuff
    startTime = new Date().getTime();
    timerDisplay = foregroundLayer.addChild(new Timer());
    // Score stuff
    scoreDisplay = foregroundLayer.addChild(new Score());
    // Lives stuff
    livesDisplay = foregroundLayer.addChild(new Lives());

    // Answers and questions (in this order)
    initializeAnswers();
    initializeQuestions(); 
    updateCurrentAnswer();
    // Initial positions and sizing
    initializeAnswerPositions();
    initializeQuestionPositions();

    // Looper
    createjs.Ticker.setFPS(60);
    // Handles all the update logic
    createjs.Ticker.on("tick", handleTick); 

    console.log(stage.children.length);
}

function handleTick(event) {
    if (!event.paused) {
        // Update (kinda)
        updateTimeRemaining();
        // Render 
        stage.update();
    }
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
    }

    // Format to two decimal places (rounds too)
    var formattedTime = (remainingTime / 1000).toFixed(2);
    // Display the time left
    timerDisplay.txt.text = formattedTime;
}

//use this function when question is correct
function increaseScore(){
    console.log("increaseScore()");
    score += Math.round(BASE_GAIN + (Math.round(remainingTime) /10000)) * 10;
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
        console.log("generateNextAnswer()");

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
        // Create the next answer 

    // Finalize setup 
    var nextAnswer = foregroundLayer.addChild(new Answer(randInt)); // Create the actual object
    if (currentAnswer != null) {
        nextAnswer.index = currentAnswer.index; // Pass on parent index
        nextAnswer.x = currentAnswer.x;         // Pass on parent position
    }
    // Return the displayObject 
    return nextAnswer;
}

// Gathers are all the necessary info before generating the next answer
function prepareNextQuestion() {
    console.log("prepareNextQuestion()");


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
            console.log("generateNextQuestion()");


    var answer = prepareNextQuestion();

    var question;

    var randNum = getRandomInt(1, 4);
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
    return backgroundLayer.addChild(question);
}

function generateSum(answer) {
    var numA = getRandomInt(0, answer);
    var numB = answer - numA;
    return new Question(numA, "+", numB, answer);
}
function generateMinus(answer) {
    var numA = getRandomInt(answer, answer + 20);
    var numB = numA - answer;
    return new Question(numA, "-", numB, answer);
}
function generateMultiplication(answer) {
    do{
        var numA = getRandomInt(1,10);
    }while(answer%numA != 0)
    
    var numB = answer / numA;
    var question = new Question(numA, "*", numB, answer);
    return question;
}
function generateDivision(answer) {
    var numA = getRandomInt(1, 10);
    var numB = answer * numA;
    var question = new Question(numB, "/", numA, answer);
    return question;
}

// Move all objects up one position (overwritting the first)
function advanceRows(newQuestion) {
                console.log("advanceRows()");

    // Animations: (Individually animate each one)
    // Bottom question
    createjs.Tween.get(questions[0])
        .to({ y:(layout.MID3 + questions[0].y), alpha: 0 }, 300, createjs.Ease.linear)
        .call( function() {
            this.visible = false; 
        });
    // Next question
    createjs.Tween.get(questions[1])
        .to({ y:(layout.MID3), scaleY: 1.66 }, 300, createjs.Ease.linear); // Advance position
    createjs.Tween.get(questions[1].getChildAt(1))
        .to({ scaleX: 1.66 }, 300, createjs.Ease.linear); // Enlarge text (scaleY taken care above)
    // Last question
    createjs.Tween.get(questions[2])
        .to({ y:(layout.MID2) }, 300, createjs.Ease.linear); 
    // New question
    createjs.Tween.get(newQuestion)
        .to({ y:layout.MID1}, 300, createjs.Ease.linear);  

    // Advance the questions internally
    questions[0] = questions[1];
    questions[1] = questions[2];
    questions[2] = newQuestion
}

function advanceAnswers(nextAnswer) {
                    console.log("advanceAnswers()");

    // Animations:
    // Current answer
    createjs.Tween.get(currentAnswer)
        .to({ alpha: 0, scaleX: 0.6, scaleY: 0.6}, 200, createjs.Ease.linear)
        .call( function() { this.visible = false });
    // Next answer
    nextAnswer.alpha = 0;       // Start invisible
    nextAnswer.scaleX = 1.2;    // Start large
    nextAnswer.scaleY = 1.2;
    createjs.Tween.get(nextAnswer)
        .to({}, 100, createjs.Ease.linear)
        .to({ alpha: 1, scaleX: 1, scaleY: 1 }, 300, createjs.Ease.linear);

    // Advance (replace) the answer internally
    answers[nextAnswer.index] = nextAnswer; // Replace parent 
}

// Answer checking
function checkAnswer(answer) {
    return (answer == questions[0].answer);
}

function answerCorrect() {
                        console.log("answerCorrect()");

    // GAME-LOGIC(?)
    increaseScore();                        // Update the score
    startTime = new Date().getTime();       // Reset the time (Set the time stamp to now)
    
    // GAME-FUNCTIONS
    advanceAnswers(generateNextAnswer());   // Create the next answer, animate, and setup
    advanceRows(generateNextQuestion());    // Create the next question, animate, and setup
    updateCurrentAnswer();
}

function answerIncorrect() {
    console.log("answerIncorrect()");

    // GAME-LOGIC(?)
    // Update lives 
    livesRemaining--;
    livesDisplay.txt.text = livesRemaining;
    // Reset the time
    startTime = new Date().getTime();

    // GAME-FUNCTIONS
    advanceAnswers(generateNextAnswer());   // Create the next answer, animate, and setup
    advanceRows(generateNextQuestion());    // Create the next question, animate, and setup
    updateCurrentAnswer();

    // Check if user lost
    if (livesRemaining <= 0) {
        gameOver();
    }
}

function gameOver() {
    console.log("gameOver()");
    // Pause the game
    createjs.Ticker.paused = true;
    // Show user's score
    $('#instance-score').text("Score: " + score);
    // Show the dialog 
    $.mobile.changePage("#score-dialog", { role: "dialog" });
}

// Sets the currentAnswer to the answer object for the bottom most question. 
function updateCurrentAnswer() {
        console.log("updateCurrentAnswer()");

    for (a = 0; a < answers.length; a++) {
        if (checkAnswer(answers[a].answer)) {
            currentAnswer = answers[a];
        }
    }
}

// POSITIONING
function initializeQuestionPositions() {
    for (q=0; q<3; q++) {
        switch (q) {
            case 0:
                questions[q].y = layout.MID3; // Lowest
                questions[q].scaleY = 1.66;
                questions[q].getChildAt(1).scaleX = 1.66;
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

function initializeAnswerPositions() {
    for (a = 0; a < 5; a++) {
        // x and y of the CENTER of the container. (not top left)
        answers[a].x = (layout.ANS_SIZE / 2) + (a)*(layout.ANS_SIZE);

        console.log("Ans x: " + answers[a].x + " y: " + answers[a].y);
    }
}


// SCORE
function submitScore(){ 
    var name = document.getElementById('basic').value;
    $.ajax( { url: "https://api.mongolab.com/api/1/databases/numrush2910/collections/leaderboard?apiKey=2wY4G3-jDGhBVdvAO7TGBpN2dV27JFoL",
          data: JSON.stringify(  {"username": name,"score":score}
             ),
          type: "POST",
          contentType: "application/json" } );

}
