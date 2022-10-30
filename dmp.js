const manifestUri =
    'https://bhaart-videos.s3.ap-south-1.amazonaws.com/sriramachandra/dash-sri-ramachandra-sd-st.mpd';


async function init() {
    console.log('dmp.js ');

    const video = document.getElementById('video');
    const videoContainer = document.getElementById('videoContainer');
    const player = new shaka.Player(video);
    const ui = new shaka.ui.Overlay(player, videoContainer, video);
    const controls = ui.getControls();
    const config = {
        controlPanelElements: [
            //'skip',
            //'time_and_duration',
             'spacer',
             'mute',
             'volume',
             'fullscreen',
             'overflow_menu',
             'dmp_phrase_bar',
             'dmp_prev_phrase',
             'dmp_loop_phrase',
             'dmp_next_phrase'
        ],
        overflowMenuButtons: [
            // 'captions',
            // 'quality',
            // 'language',
            // 'picture_in_picture',
            // 'cast',
            // 'playback_rate'
        ],
        addSeekBar: true, 
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
    window.player = player;
    window.ui = ui; 
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


    // await player.addChaptersTrack(
    //     'https://bhaart-videos.s3.ap-south-1.amazonaws.com/sriramachandra/SriRamachandraKripalu_chapters.vtt',
    //     'en'
    // );

    await player.addChaptersTrack(
        'SriRamachandraKripalu_chapters.vtt',
        'en'
    );

    //Load the UI only after the chapters track is loaded
    //This will ensure the phrase bar is correctly displayed with phrases
    ui.configure(config);

}



function onPlayerErrorEvent(errorEvent) {
    // Extract the shaka.util.Error object from the event.
    onPlayerError(errorEvent.detail);
}
  
function onPlayerError(error) {
    // Handle player error
    console.error('Error code', error.code, 'object', error);
}

function onUIErrorEvent(errorEvent) {
    // Extract the shaka.util.Error object from the event.
    onPlayerError(errorEvent.detail);
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