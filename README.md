# numrush
Term One Project

-- Structure of project --

Root (contains all the html files)
  - css (contains all the css files with the same name as the html)
  - js (contains all the page functions)
    - objects (contains all the EaselJS extended objects)
  - sound (contains all the audio)
  - img (contains all the images and graphics used in the game)
  - test (Area for testing, debugging and unstable code)
  
-- Code structure  -- 
1. The main javascript file that controls the main game mode (competitive mode) is called play.js, for the practice mode - practice.js
2. This script uses functions from the jQuery framework, CreateJS framework, object scripts, and helper scripts such as globalVariables.js and utility.js
3. Individual objects require their own file named after the object, which is to be located in object folder
4. All variables and constants that apply to the game mode specifically are located in the top of the respected game mode file (ex. play.js)
5. Positioning, global constants, and any other variables that apply to all game modes are located in the globalVariables.js
6. Utility methods (methods that work in any script) are located in utility.js
7. game mode methods are structured as following
  a) initializers 
  b) game logic (updates and rendering)
  c) audio 
  d) answer checking 
  e) score 
