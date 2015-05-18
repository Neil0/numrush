// EaselJS 
var canvas, stage;

// Game Info
var OPERATORS = ["+", "-", "x", "/"];

var questions = [];
var answers = [];
var currentAnswer; // Note: This is an object, to access the answer value use currentAnswer.answer

var correct = 0;
var incorrect = 0;
var correctIndicator, incorrectIndicator;

// Difficulty
var DIFFICULTY_COUNT = 20;  // Every (20) corrects progresses
var difficultyController = new DifficultyController();  // Controls the difficulty
var termRange = {min: 2, max: 2};       // Only supports 2-3 terms
var operatorRange = { min: 0, max: 1};  // 0 = +, 1 = -, 2 = x, 3 = / 

// Layers
var foregroundLayer = new createjs.Container(); 
var backgroundLayer = new createjs.Container(); // Only contains questions
// DisplayObjects
var scoreDisplay;
var timerDisplay;
var livesDisplay;

// Audio
var sfxEnabled; // Determined by loadSfx()


 
// Initialize all base variables and preload assets. Once assets are loaded it will call init. 
function init() {
    // Canvas info
    canvas = document.getElementById("canvas"); 
    fullScreenCanvas(canvas);                           // Sets width and height to fill screen
    // Stage info
    stage = new createjs.Stage(canvas);                 // Creates a EaselJS Stage for drawing
    stage.addChild(backgroundLayer, foregroundLayer);   // Add layers
    // Detection
    stage.enableMouseOver();    // TODO: Remove this later (change with touch or something?)

    // Initialize global variables for layout and sizing
    initializeVariables(canvas.width, canvas.height);

    // Preload all assets (crucial for first rendering)
    initializeAssets(); // Note: Once finish it will call initGame()
}

function initGame() {
    // Audio:
    // TODO: sfx and bgm

    // Initialization: 
    // Indicator stuff
    correctIndicator = foregroundLayer.addChild(new CorrectIndicator());
    incorrectIndicator = foregroundLayer.addChild(new IncorrectIndicator());

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
        // Render 
        stage.update();
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
                if (answers[j].answer == randInt) {
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
    // Init the question     
    var question;
 
    // Retrieve the next answer 
    var answer = prepareNextQuestion();
 
    // Generate a 2 or 3 term question
    var randTerm = getRandomInt(termRange["min"], termRange["max"]);

    // Generating a 2 term question
    if (randTerm == 2) {
        // Initialize the pieces (operands, operators, answer)
        var fullSet = [];
        var numSet = [];
        var operatorSet = [];
        
        // Calculate the pieces
        operatorSet[0] = OPERATORS[getRandomInt(operatorRange["min"], operatorRange["max"])];
        numSet = generateSet(answer, operatorSet[0]);
        
        // Assemble all the pieces
        fullSet[0] = numSet;
        fullSet[1] = operatorSet;
        fullSet[2] = answer;
        
        // Create the question
        question = new Question(fullSet); 
 
    // Generating a 3 term question
    } else {
        // Init
        var fullSet = []; 
        var numSet = [];
        var operatorSet = [];
 
        // Set up (random) operators
        operatorSet[0] = OPERATORS[getRandomInt(operatorRange["min"], operatorRange["max"])];
        operatorSet[1] = OPERATORS[getRandomInt(operatorRange["min"], operatorRange["max"])];

        // Begin generation logic
        var operatorCode = operatorSet[0] + operatorSet[1];
        switch (operatorCode) {
            // Calculate left to right (normal)
            case "++":
            case "+-":
            case "+x":
            case "+/":            
            case "-x":
            case "-/":
            case "xx":
            case "x/":
                var numSetL = generateSet(answer, operatorSet[0]);      // #1 OP #2 OP ?
                // take middle operator and expand                      // #1 OP (#2) OP ?
                var numSetR = generateSet(numSetL[1], operatorSet[1]);  // #1 OP #3 OP #4    
                // Assemble numSet, nsl[0] OP nsr[0] OP nsr[1]
                numSet = [numSetL[0], numSetR[0], numSetR[1]];
                break;
            // Calculate right to left (reversed)
            case "-+":
            case "--":
            case "x+":
            case "x-":
            case "/+":
            case "/-":
            case "/x":
            case "//":
                // Calculate right to left
                var numSetR = generateSet(answer, operatorSet[1]);      // ? OP #1 OP #2
                    // take middle operator and expand                  // ? OP (#1) OP #2
                var numSetL = generateSet(numSetR[0], operatorSet[0]);  // #3 OP #4 OP #2    
                // Assemble, nsl[0] +- nsl[1] x/ nsr[1];
                numSet = [numSetL[0], numSetL[1], numSetR[1]];  
                break;
        }
 
        // Assemble numbers and operators
        fullSet[0] = numSet;
        fullSet[1] = operatorSet;
        fullSet[2] = answer; // From above
 
        // Create the question with the set
        question = new Question(fullSet);
    }
 
    // Return the display object 
    return backgroundLayer.addChild(question);
}

// Returns an array of numbers, and an array of operators (for the question).
function generateSet(answer, operator) {
    switch (operator) {
        case "+":
            return generateSum(answer);
            break;
        case "-":
            return generateMinus(answer);
            break;
        case "x":
            return generateMultiplication(answer);
            break;
        case "/":
            return generateDivision(answer);
            break;
        default:
            console.log("something went wrong with generateNextQuestion()");
            break;
    }
}

function generateSum(answer) {
    var numA = getRandomInt(0, answer);
    var numB = answer - numA;
    var numSet = [numA, numB];     // [[nums][operators]answer];
    return numSet;
}
function generateMinus(answer) {
    // TODO: The difference will always be from 1-20, might want to base it off the answer it self
    var numA = getRandomInt(answer, answer + 20);
    var numB = numA - answer;
    var numSet = [numA, numB];
    return numSet;
}
function generateMultiplication(answer) {
    do{
        var numA = getRandomInt(1,10);
    }while(answer%numA != 0)
    
    var numB = answer / numA;
    var numSet = [numA, numB];
    return numSet;
}
function generateDivision(answer) {
    var numA = getRandomInt(1, 10);
    var numB = answer * numA;
    var numSet = [numB, numA];
    return numSet;
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
    correct++;
    correctIndicator.txt.text = correct;
    updateDifficulty();
 
    // GAME-FUNCTIONS
    advanceAnswers(generateNextAnswer());   // Create the next answer, animate, and setup
    advanceRows(generateNextQuestion());    // Create the next question, animate, and setup
    updateCurrentAnswer();
}

function answerIncorrect() {
    console.log("answerIncorrect()");

    // GAME-LOGIC(?)
    incorrect--;
    incorrectIndicator.txt.text = incorrect;

    // GAME-FUNCTIONS
    advanceAnswers(generateNextAnswer());   // Create the next answer, animate, and setup
    advanceRows(generateNextQuestion());    // Create the next question, animate, and setup
    updateCurrentAnswer();
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

// Cycles difficulty
function updateDifficulty() {
    difficultyController.currentCount++;
    
    if (difficultyController.currentCount >= DIFFICULTY_COUNT) {
        difficultyController.currentCount = 0;
        difficultyController.nextDifficulty();
    }
}

function DifficultyController() {
    this.currentCount = 0;
    // [[term min, term max, op min, op max], ...]
    this.difficulties = [
        [2, 2, 0, 1],
        [2, 2, 0, 3],
        [2, 3, 0, 1],
        [2, 3, 0, 3],
        [3, 3, 0, 3]
    ]
    this.index = 0;

    this.nextDifficulty = function() {
        // Next difficulty
        if (this.index == this.difficulties.length - 1) {
            this.index = 0;
        } else {
            this.index++;
        }

        // Load difficulty 
        termRange.min = this.difficulties[this.index][0];
        termRange.max = this.difficulties[this.index][1];
        operatorRange.min = this.difficulties[this.index][2];
        operatorRange.max = this.difficulties[this.index][3];
    }
}

