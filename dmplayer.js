const manifestUri =
    'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';

async function init() {

    //retrieve video element 
    const video = document.getElementById('video');

    //retrieve video-container element
    const videoContainer = document.getElementById('videoContainer');

    //instantiate shaka player
    const player = new shaka.Player(video);

    //instantiate video overlay
    const ui = new shaka.ui.Overlay(player, videoContainer, video);

    //get the ui controls
    const controls = ui.getControls();

    //set ui configuration options
    const config = {
        controlPanelElements: [
            // 'time_and_duration',
            // 'spacer',
            // 'mute',
            // 'volume',
            // 'fullscreen',
            // 'overflow_menu'
        ],
        overflowMenuButtons: [
            // 'captions',
            // 'quality',
            // 'language',
            // 'picture_in_picture',
            // 'cast',
            // 'playback_rate'
        ],
        addSeekBar: false, 
        addBigPlayButton: true,
        // fadeDelay: 0,
        // doubleClickForFullscreen: true,
        // singleClickForPlayAndPause: true,
        // enableKeyboardPlaybackControls: true,
        // enableFullscreenOnRotation: true,
        // forceLandscapeOnFullscreen: true,
        // enableTooltips: false,
        // keyboardSeekDistance: 5  
    };

    ui.configure(config);
 

    // Attach player and ui to the window to make it easy to access in the JS console.
    window.player = player;
    window.ui = ui; 
    
    // Listen for error events.
    player.addEventListener('error', onPlayerErrorEvent);
    controls.addEventListener('error', onUIErrorEvent);
   
    // Try to load a manifest.
    // This is an asynchronous process.
    try {
        await player.load(manifestUri);
        // This runs if the asynchronous load is successful.
        console.log('LOG: The video has now been loaded!');
    } catch (error) {
        onPlayerError(error);
    }
    
}

function onPlayerErrorEvent(errorEvent) {
    // Extract the shaka.util.Error object from the event.
    onPlayerError(event.detail);
}
  
function onPlayerError(error) {
    // Handle player error
    console.error('Error code', error.code, 'object', error);
}

function onUIErrorEvent(errorEvent) {
    // Extract the shaka.util.Error object from the event.
    onPlayerError(event.detail);
}

function initFailed(errorEvent) {
    // Handle the failure to load; errorEvent.detail.reasonCode has a
    // shaka.ui.FailReasonCode describing why.
    console.error('Unable to load the UI library!');
}

// Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded.
document.addEventListener('shaka-ui-loaded', init);

// Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
// to load (e.g. due to lack of browser support).
document.addEventListener('shaka-ui-load-failed', initFailed);
