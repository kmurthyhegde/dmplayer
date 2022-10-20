const manifestUri =
    'https://bhaart-videos.s3.ap-south-1.amazonaws.com/sriramachandra/dash-sri-ramachandra-sd-st.mpd';

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
            'skip',
             'time_and_duration',
             'spacer',
             'mute',
             'volume',
             'fullscreen',
             'overflow_menu'
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

    await player.addChaptersTrack(
        'https://bhaart-videos.s3.ap-south-1.amazonaws.com/sriramachandra/SriRamachandraKripalu_chapters.vtt',
        'en'
    );

    onVideoLoad();
    
}


function onVideoLoad() {
    console.log('LOG: onVideoLoad() ');


    //remove unwanted elements, for testing
    document.getElementsByClassName("shaka-ad-controls shaka-hidden")[0].remove();
    document.getElementsByClassName("shaka-play-button-container")[0].remove();
    document.getElementsByClassName("shaka-server-side-ad-container")[0].remove();
    document.getElementsByClassName("shaka-controls-button-panel")[0].remove();
    document.getElementsByClassName("shaka-client-side-ad-container")[0].remove();
    document.getElementsByClassName("shaka-spinner-container")[0].remove();
    document.getElementsByClassName("shaka-text-container")[0].remove();
    document.getElementsByClassName("shaka-scrim-container")[0].remove();
    document.getElementsByClassName("shaka-overflow-menu")[0].remove();
    document.getElementsByClassName("shaka-seek-bar-container")[0].remove();

    /*
        ADD PHRASE BAR
    */
    let bottom_controls =  document.getElementsByClassName("shaka-bottom-controls")[0];

    //add phrase bar container
    const phraseBarContainer = document.createElement('div');
    phraseBarContainer.classList.add('dmp-phrase-bar-container');
    bottom_controls.appendChild(phraseBarContainer);

    //Add phrases
    const phrases = player.getChapters('en');
    const containerWidth = document.getElementById("videoContainer").clientWidth;
    const borderWidth = 0;
    const videoLength = phrases[phrases.length-1].endTime;

    phrases.forEach(phrase => {
        const phraseBar = document.createElement('div');
        phraseBar.style.width = "" + ((phrase.endTime - phrase.startTime)*100.0)/videoLength + "%";
        phraseBar.classList.add('dmp-phrase-bar');
        phraseBarContainer.appendChild(phraseBar);
        console.log('endTime: ' + phrase.endTime + ' startTime: ' + phrase.startTime + ' width: ' + phraseBar.style.width);
    });
    
    //Highlight current phrase
    console.log('LOG: phrase bar count: ' + document.getElementsByClassName("dmp-phrase-bar").length);
    const currentPhraseBar = document.getElementsByClassName("dmp-phrase-bar")[10];
    currentPhraseBar.classList.add('dmp-current-phrase-bar');
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
