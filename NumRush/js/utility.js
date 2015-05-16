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
        // 5 X 3, bounded by window height
        targetCanvas.width = window.innerHeight * 3 / 5; 
        targetCanvas.height = window.innerHeight;
    }

    console.log("Window width: " + window.innerWidth + " height: " + window.innerHeight);
}

// Not used
function getScaleFactor(rawLength, targetLength) {
  return targetLength / rawLength;
}