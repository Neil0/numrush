$(document).ready(function() {    
    // -- FIELDS --
    var $bgmToggle = $('#bgm-toggle');
    var $sfxToggle = $('#sfx-toggle');
    var $bgm = $('#menu-bgm');
    var $sfx = $('#menu-sfx');

    // Initialization
    loadUnlockedAchievements();

    $bgmToggle.bind("tap", bgmHandler);
    $sfxToggle.bind("tap", sfxHandler);
    loadAudioButtons();


    // -- HANDLERS --
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
    // Grey out locked achievements
    function loadUnlockedAchievements() {
        $firstBlood = $('#achieve-FirstBlood');
        $hotStreak = $('#achieve-HotStreak');
        $snoozeLose = $('#achieve-YouSnoozeYouLose');
        $trainingBegins = $('#achieve-YourTrainingBegins');

        if (localStorage.getItem("achieve-FirstBlood") != "true") {
            $firstBlood.addClass("gray-out");
        }
        if (localStorage.getItem("achieve-HotStreak") != "true") {
            $hotStreak.addClass("gray-out");
        }
        if (localStorage.getItem("achieve-YouSnoozeYouLose") != "true") {
            $snoozeLose.addClass("gray-out");
        }
        if (localStorage.getItem("achieve-YourTrainingBegins") != "true") {
            $trainingBegins.addClass("gray-out");
        }
    }

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

function buttonSound() {
    var sfx = document.getElementById("menu-sfx");
    sfx.play();
}
