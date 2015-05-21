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

function buttonSound() {
    var sfx = document.getElementById("menu-sfx");
    sfx.play();
}
