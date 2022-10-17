//Dummy Code. Not used currently
shaka.ui.PhraseSeekBar = class extends shaka.ui.Element {
    constructor(parent, controls) {
      super(parent, controls);
  
      // The actual button that will be displayed
      this.button_ = document.createElement('button');
      this.button_.textContent = 'Skip current video1';
      this.parent.appendChild(this.button_);
  
      // Listen for clicks on the button to start the next playback
      this.eventManager.listen(this.button_, 'click', () => {
        console.log('LOG: Inside Phrase Seek Bar');
      });
    }
  };
  
  
  // Factory that will create a button at run time.
  shaka.ui.PhraseSeekBar.Factory = class {
    create(rootElement, controls) {
      return new shaka.ui.PhraseSeekBar(rootElement, controls);
    }
  };
  
  // Register our factory with the controls, so controls can create button instances.
  shaka.ui.Controls.registerElement(
    /* This name will serve as a reference to the button in the UI configuration object */ 'skip',
    new shaka.ui.PhraseSeekBar.Factory());