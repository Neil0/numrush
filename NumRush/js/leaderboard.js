
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

    // -- INIT -- 
    // Audio
    $bgmToggle.bind("tap", bgmHandler);
    $sfxToggle.bind("tap", sfxHandler);
    loadAudioButtons();
    // Leaderboards
    retrieve();

    // -- METHODS --
    // Retrieves all the data from the data base (Use first before other functions)
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

    // Prints out rank, name, scores of the top 10 players
    function loadLeaderboard() {
        // Users local score
        if (localStorage.getItem("localscore") == null) { localStorage.setItem("localscore", "0"); }
        $('#localhighscore').text("Personal best: " + localStorage.getItem("localscore"));

        // Global score
        for (i = 0; i < jsonData.length; i++) {
            // Row that contains the rank, name, and score
            var $newRow = $("<tr>");
            // Create rank
            var $newRank = $("<td>", { text: ++rank });
            // Create name
            var $newName = $("<td>", { text: jsonData[i].username });
            // Create score
            var $newScore = $("<td>", { text: jsonData[i].score });

            // Add to DOM
            $newRow.append($newRank);    // Rank column
            $newRow.append($newName);    // Name column
            $newRow.append($newScore);   // Score column
            $leaderTable.append($newRow);     // End row tag
        }
    }

    // -- HANDLERS --
    function bgmHandler(event) { toggleBgm(); }
    function sfxHandler(event) { toggleSfx(); }

    // -- METHODS --
    function loadAudioButtons() {
        // Sfx init
        if (localStorage.getItem("sfx-muted") == "true") {
            $sfxToggle.attr('src', 'img/sfx_off.png');
        } else {
            $sfxToggle.attr('src', 'img/sfx_on.png');
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
            $sfxToggle.attr('src', 'img/sfx_on.png');   // Display sfx on image
            $sfx.get(0).play();                         // Play the sfx sound
            localStorage.setItem("sfx-muted", "false"); // Un-mute sfx globally
        } else {
            $sfxToggle.attr('src', 'img/sfx_off.png');  // Display sfx off image
            localStorage.setItem("sfx-muted", "true");  // Mute sfx globally
        }
    }

    function toggleBgm() {
        if (localStorage.getItem("bgm-muted") == "true") {
            $bgmToggle.attr('src', 'img/bgm_on.png');   // Display bgm on image
            $bgm.get(0).play();                         // Resume the bgm
            localStorage.setItem("bgm-muted", "false"); // Un-mute sfx globally
        } else {
            $bgmToggle.attr('src', 'img/bgm_off.png');  // Display bgm off image
            $bgm.get(0).pause();                        // Pause the bgm
            localStorage.setItem("bgm-muted", "true");  // Un-mute sfx globally
        }
    }
});