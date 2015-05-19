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

// -- PRELOAD ASSETS --
var preload = new createjs.LoadQueue();
preload.on("progress", handleOverallProgress); 
preload.on("complete", handleComplete, this);
var manifest = [
    {src: 'img/bg.png', id: 'bg'},
    {src: 'img/score_bg.png', id: 'scoreBack'},
    {src: 'img/lives_bg.png', id: 'lifeBack'},
    {src: 'img/life.png', id: 'life'},
    {src: 'img/no_life.png', id: 'nolife'},
    {src: 'img/question_bg.png', id: 'quesBack'},
    {src: 'img/question_center.png', id: 'quesCenter'},
    {src: 'img/timer_bomb.png', id: 'timer'},
    {src: 'img/answer.png', id: 'ans'}
];
preload.loadManifest(manifest);

function handleOverallProgress(event) {
    console.log("Progress:", preload.progress, event.progress);
    var progressPercent = (preload.progress * 100).toFixed(2) + "%";
    $("#loading-indicator").text(progressPercent);
}

function handleComplete(event) {
    $("#loading-div").hide();
}

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
