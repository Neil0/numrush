
$(document).ready(function() {
    // -- FIELDS --
    // DOM
    var $bgmToggle = $('#bgm-toggle');
    var $sfxToggle = $('#sfx-toggle');
    var $bgm = $('#menu-bgm');
    var $sfx = $('#menu-sfx');
    var $leaderTable = $('#leader-table');
    // Leaderboards
    var jsonData;
    var complete = 0;
    var rank = 0;

    // Initialization
    // Audio
    $bgmToggle.bind("tap", bgmHandler);
    $sfxToggle.bind("tap", sfxHandler);
    loadAudioButtons();
    // Leaderboards
    retrieve();


    //USE THIS SHIT BEFORE CALLING ANY FUNCTIONS THAT WILL QUERY THE DATABASE!!!!!!!!!!!!
    function retrieve() {
        $.ajax({
            dataType: "json",
            //url now picks top 10 scores & usernames in order from highest to lowest score
            url: "https://api.mongolab.com/api/1/databases/numrush2910/collections/leaderboard?s={%22score%22:-1}&l=10&apiKey=2wY4G3-jDGhBVdvAO7TGBpN2dV27JFoL",
            success: function(data) {
                complete = 1;
                jsonData = data;
                loadLeaderboard();
            }
        });

    }

    //prints out rank, name, scores of the top 10 (5?) players according to score
    function loadLeaderboard() {
        console.log("loadLeaderboard()");

        for (i = 0; i < jsonData.length; i++) {
            var $newRow = $("<tr>");
            // Create rank
            var $newRank = $("<td>", {
                text: ++rank
            });
            // Create name
            var $newName = $("<td>", {
                text: jsonData[i].username
            });
            // Create score
            var $newScore = $("<td>", {
                text: jsonData[i].score
            });

            // Add to DOM
            $newRow.append($newRank);    // Rank column
            $newRow.append($newName);    // Name column
            $newRow.append($newScore);   // Score column
            $leaderTable.append($newRow);     // End row tag
        }
    }






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