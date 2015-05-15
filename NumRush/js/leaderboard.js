retrieve();

var jsonData;
var complete = 0;
//USE THIS SHIT BEFORE CALLING ANY FUNCTIONS THAT WILL QUERY THE DATABASE!!!!!!!!!!!!

function retrieve(){
$.ajax({
  dataType: "json",
  //url now picks top 10 scores & usernames in order from highest to lowest score
  url: "https://api.mongolab.com/api/1/databases/numrush2910/collections/leaderboard?s={%22score%22:-1}&l=10&apiKey=2wY4G3-jDGhBVdvAO7TGBpN2dV27JFoL",
  success: function(data) {
	complete = 1;
  	jsonData = data;
  }
});
alert("done");
}

//prints out names of the top 10 players according to score
function callName(){
var table = document.getElementById('nametable');
	for (i = jsonData.length-1; i >= 0; i--) {
		var row = table.insertRow(0);
		var cell = row.insertCell(0);
		cell.innerHTML =jsonData[i].username;
	}
}

//prints out the top 10 scores in 'scoreboard'
function callScore(){
	var table = document.getElementById('scoretable');
	for (i = jsonData.length-1; i >= 0; i--) {
		var row = table.insertRow(0);
		var cell = row.insertCell(0);
		cell.innerHTML =jsonData[i].score;
	}
}
$(document).ready(function() {    
    // -- FIELDS --
    var $bgmToggle = $('#bgm-toggle');
    var $sfxToggle = $('#sfx-toggle');
    var $bgm = $('#menu-bgm');
    var $sfx = $('#menu-sfx');


    // Initialization
    $bgmToggle.bind("tap", bgmHandler);
    $sfxToggle.bind("tap", sfxHandler);
    loadAudioButtons();


    // -- HANDLERS --
    // Note: I almost feel that pure js here would be easier 
    function bgmHandler(event) {
        // Retrieve the selected element
        var $targetElement = $(event.target); // Not used

        toggleBgm();
    }
    
    function sfxHandler(event) {
        // Retrieve the selected element
        var $targetElement = $(event.target); // Not used

        toggleSfx();
    }


    // -- METHODS --
    function loadAudioButtons() {
        // Sfx init
        if (localStorage.getItem("sfx-muted") == "true") {
            $sfxToggle.addClass('off');
        } else {
            $sfxToggle.removeClass('off');
        }
        // bgm init
        if (localStorage.getItem("bgm-muted") == "true") {
            $bgmToggle.attr('src', 'img/bgm_off.png');
        } else {
            $bgmToggle.attr('src', 'img/bgm_on.png');
            $bgm.get(0).play();
        }
    }

    function toggleSfx() {
        if (localStorage.getItem("sfx-muted") == "true") {
            $sfxToggle.removeClass('off');
            $sfx.get(0).play();
            localStorage.setItem("sfx-muted", "false"); // Un-mute sfx globally
        } else {
            $sfxToggle.addClass('off');
            localStorage.setItem("sfx-muted", "true"); // Mute sfx globally
        }
    }

    function toggleBgm() {
        if (localStorage.getItem("bgm-muted") == "true") {
            $bgmToggle.attr('src', 'img/bgm_on.png');
            $bgm.get(0).play();
            localStorage.setItem("bgm-muted", "false"); // Un-mute sfx globally
        } else {
            $bgmToggle.attr('src', 'img/bgm_off.png');
            $bgm.get(0).pause();
            localStorage.setItem("bgm-muted", "true"); // Un-mute sfx globally
        }
    }
});