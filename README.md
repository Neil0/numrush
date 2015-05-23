-------------
1. TEAM INFO
-------------
	Team Number: 11
	Team Name: Team Exodia
	Team Members: Jason Cheung, Jordan Hamade, Neil Jaggi, Ryan Gahkar

-------------------
2. PROJECT OVERVIEW
-------------------
	Game Name: NumRush
	Description: Math based problem-solving game that rewards users who solve questions efficiently while being pressured by a time constraint.

-----------------
3. CODE STRUCTURE
-----------------
Guidelines:
	1. Within all JS files, major sections denoted by a fully capitalized name surrounded by "--"
		Ex. "// -- SECTION NAME --"
	Major sections are listed in this order for all files. If the file does not have the specified section it is omitted.
		-- PRELOAD --
		-- FIELDS --
		-- INITIALIZATION --
		-- HANDLERS --
		-- METHODS --
	2. Further sub-sections follow the same pattern without the "--"
		Ex. "// SUB-SECTION NAME"
	3. Global variables and constants that are used by various scripts should be located in the globalVariables.js. 
		This is used as a information centre, changes in multiple component properties and positioning can be done with this one file.
	4. Utility functions (ie. functions that can work with any code) should be placed in the utility.js file.
	5. EaselJS objects or lengthy JS objects should be saved in the js/objects folder. File and object name should start with a capital. 
	
Code structure:
	The core script that controls the main game mode is play.js
	The structure of the file is as follows (All other files follow similar but trimmed format):

	-- PRELOAD -- 
		The preload queue object is created here, as well as the manifest of which assets need to be loaded.
		
	-- FIELDS -- 
		All the fields used by this game mode are found here. 
		Order of fields should be DOM > Game Info/components > Visuals > Audio. 
		
	-- INITIALIZATION --
		Contains 2 main functions that are called when the user lands on the page.
		init() : Initializes DOM's, global variables, and preloads assets.
		initGame() : Initializes all game components and starts the game.
		
	-- HANDLERS --
		Any handler type functions (functions that take "event" arguments).
		
	-- METHODS --
		Contains all other methods. Subsections are as follows (for play.js)
		// INITIALIZERS : Creation of the first questions and answers as well as initial positioning.
		// GAME LOGIC : Core functionality of the game (question generation, updates, animating, etc.).
		// ANSWER CHECKING : Related to validating users answer, and the actions taken if correct or incorrect. While GAME LOGIC is static, ANSWER CHECKING is different for each game mode.
		// SCORE DIALOG : Methods related to the game over screen (which is a dialog that shows users score). Should not affect core game functionality in any way. 

--------------------
4. TECHNOLOGIES USED
--------------------
Languages:
	- JavaScript 
	- JSON
	- HTML
	- CSS
Frameworks:
	- jQuery
	- jQuery Mobile
	- CreateJS (Consist of 4 frameworks below)
		- EaselJS
		- TweenJS
		- SoundJS
		- PreloadJS
Services:
	- MongoDB
	- 000WebHost
	- GitHub
	- OneDrive
	- Google Drive
	- WhatsApp
Technologies:
	- Photoshop
	- Google Chrome DevTools
	- localStorage
	- Cache 
	
------------------------------
5. Issues/Problems encountered
------------------------------
	- Code overwriting
	- Meeting assigned deadlines
	- Loss of member & member absence
	- Different communication channels
	- Inexperience (new frameworks, MongoDB, etc.)
	
	