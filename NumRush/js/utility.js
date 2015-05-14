// random number between range - inclusive 
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shuffle an array by Fisher-Yates 
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

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

// Fullscreen a canvas 
function fullScreenCanvas(targetCanvas) {
    // Check if in vertical orientation
    if (window.innerWidth < window.innerHeight) {
        // Fullscreen the canvas
        targetCanvas.width = window.innerWidth;
        targetCanvas.height = window.innerHeight;
    } else {
        // Sadly requires global variables to work
        targetCanvas.width = layout.DEF_WIDTH;
        targetCanvas.height = layout.DEF_HEIGHT;
    }

    console.log("Window width: " + window.innerWidth + " height: " + window.innerHeight);
}