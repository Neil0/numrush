// -- PRELOAD --
// Note: Waiting for init() call
var preload = new createjs.LoadQueue();
/*preload.on("fileload", foo, bar);
preload.on("progress", foo, bar);*/ 
preload.on("complete", handleComplete, this);
var manifest = [
    {src: 'img/bg.png', id: 'bg'},
    {src: 'img/life.png', id: 'life'},
    {src: 'img/no_life.png', id: 'nolife'},
    {src: 'img/answer.png', id: 'ans'}
];

function handleComplete(event) {
    console.log("All files loaded");
    initGame();
}
// -- END PRELOAD --

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
var midLayer = new createjs.Container(); // Only contains questions
var backgroundLayer = new createjs.Container();

// DisplayObjects
var scoreDisplay;
var timerDisplay;
var livesDisplay;

// Audio
var sfxEnabled;
var bgmEnabled;
 
// Initialize all base variables and preload assets. Once assets are loaded it will call init. 
function init() {
    console.log("init()");

    // Canvas info
    canvas = document.getElementById("canvas"); 
    fullScreenCanvas(canvas);                           // Sets width and height to fill screen
    // Stage info
    stage = new createjs.Stage(canvas);                 // Creates a EaselJS Stage for drawing
    stage.addChild(backgroundLayer, midLayer, foregroundLayer);   // Add layers
    // Detection
    stage.enableMouseOver();    // TODO: Remove this later (change with touch or something?)

    // Initialize global variables for layout and sizing
    initializeVariables(canvas.width, canvas.height);

    // Preload all assets (crucial for first rendering)
    preload.loadManifest(manifest);
}

function initGame() {
    // Audio:
    sfxEnabled = (localStorage.getItem("sfx-muted") == "true") ? false : true;
    bgmEnabled = (localStorage.getItem("bgm-muted") == "true") ? false : true;
 
    createjs.Sound.initializeDefaultPlugins();
    var audiopath ="sound/";
    var sounds = [
        {src:"game_bgm.wav", id:"bg_music"},
        {src:"hitsound1.wav", id:"correct"},
        {src:"miss.mp3", id:"incorrect"},
        {src:"failsound.mp3", id:"gameover"}
    ];
    createjs.Sound.addEventListener("fileload", bgm);   // Will call bgm() when loaded
    createjs.Sound.registerSounds(sounds, audiopath);

    // Initialization: 
    // Background
    var bgImage = preload.getResult("bg");
    var background = new createjs.Bitmap(bgImage);
    setScaleFactor(background, canvas.width, canvas.height);
    backgroundLayer.addChild(background);

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

    // Achievements
    if (localStorage.getItem("achieve-Rocky") == "false") {
        // TODO: Some shit fuck
        localStorage.setItem("achieve-Rocky", "true");
    }

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
                questions[q].animate1stPosition();
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
        answers[a].x = (properties.ANS_SIZE / 2) + (a)*(properties.ANS_SIZE);

        console.log("Ans x: " + answers[a].x + " y: " + answers[a].y);
    }
}


// AUDIO
function bgm(event){
    console.log("Audio loaded");
    if(bgmEnabled){
        var instance = createjs.Sound.play("bg_music", { loop: -1 });
    }
}
function correctSfx() { 
    if (sfxEnabled) { var instance = createjs.Sound.play("correct"); }
}
function incorrectSfx() { 
    if (sfxEnabled) { var instance = createjs.Sound.play("incorrect"); }
}
function gameoverSfx() { 
    if (sfxEnabled) { var instance = createjs.Sound.play("gameover"); }
}
function buttonSound() { 
    if (sfxEnabled) { var sound = new Audio("buttonSound"); }
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
    return midLayer.addChild(question);
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
    questions[0].animateGone();
    // 2nd question
    questions[1].animate1stPosition();
    // 3rd question
    questions[2].animate2ndPosition();
    // New question
    newQuestion.animate3rdPosition();

    // Advance the questions internally
    questions[0] = questions[1];
    questions[1] = questions[2];
    questions[2] = newQuestion
}

function advanceAnswers(nextAnswer) {
    console.log("advanceAnswers()");

    // Animations:
    // Current answer
    currentAnswer.animateGone();
    // Next answer
    nextAnswer.animateNew();

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

    // Play sound
    correctSfx();
 
    // GAME-FUNCTIONS
    advanceAnswers(generateNextAnswer());   // Create the next answer, animate, and setup
    advanceRows(generateNextQuestion());    // Create the next question, animate, and setup
    updateCurrentAnswer();
}

function answerIncorrect() {
    console.log("answerIncorrect()");

    // GAME-LOGIC(?)
    incorrect++;
    incorrectIndicator.txt.text = incorrect;

    // Play sound
    incorrectSfx();

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

// Object that holds info about difficulty and can control it
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

