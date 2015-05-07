$(document).ready(function() {    
    // -- FIELDS --
    var $bgmToggle = $('#bgm-toggle');
    var $sfxToggle = $('#sfx-toggle');
    var $bgm = $('#menu-bgm');
    var $sfx = $('#menu-sfx');


    // Initialization
    $bgmToggle.bind("tap", bgmHandler);
    $sfxToggle.bind("tap", sfxHandler);
    // TODO: Initial checking of muting


    // -- HANDLERS --
    // Note: I almost feel that pure js here would be easier 
    function bgmHandler(event) {
        // Retrieve the selected element
        var $targetElement = $(event.target); // Not used

        // Toggle bgm mute
        // Note: prop stands for property. The successor to the attr(), but should be used when necessary only. 
        if ($bgm.prop('muted') == true) {
            $bgm.prop('muted', false); 
            localStorage.setItem("bgm-muted", "false");   
            // Alternative: play() the audio (if it's paused)
        } else {
            $bgm.prop('muted', true);
            localStorage.setItem("bgm-muted", "true");
        }
    }
    
    function sfxHandler(event) {
        // Retrieve the selected element
        var $targetElement = $(event.target); // Not used

        // Toggle sfx mute
        if (localStorage.getItem("sfx-muted") == "true") {
            // Note: I don't use toggleClass() b/c i'm a lazy fuq
            $sfxToggle.addClass('off'); 

            $sfx.get(0).play(); // Play a sfx to indicate it's un-muted
            localStorage.setItem("sfx-muted", "false"); // Un-mute sfx globally
        } else {
            $sfxToggle.removeClass('off'); // Strike through text to indicate
            localStorage.setItem("sfx-muted", "true"); // Mute sfx globally
        }
    }
});