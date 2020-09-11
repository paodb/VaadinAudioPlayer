import '@polymer/polymer/polymer-legacy.js';
import '@vaadin/vaadin-button/src/vaadin-button.js';
import '@vaadin/vaadin-ordered-layout/src/vaadin-horizontal-layout.js';
import './slider-with-caption.js';
import '@vaadin/vaadin-ordered-layout/src/vaadin-vertical-layout.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class PlayerControls extends PolymerElement {
  static get template() {
    return html`
   <style>
            :host {
                display: block;
            }

            .margin {
                margin: var(--lumo-space-m);
            }
        </style> 
   <vaadin-vertical-layout theme="" style="width: 100%; height: 100%;"> 
    <div style="width: 100%; height: 100%;">
      [[streamName]] 
    </div> 
    <div style="width: 100%; height: 100%;">
      [[time]] 
    </div> 
   </vaadin-vertical-layout> 
   <slider-with-caption id="positionSlider" caption="Position" value="0" max="1000"></slider-with-caption> 
   <vaadin-horizontal-layout theme="spacing margin" style="width: 100%; height: 100%; justify-content: center;"> 
    <vaadin-button theme="primary" id="back5Button">
      Back 5 sec 
    </vaadin-button> 
    <vaadin-button theme="primary" id="stopButton">
      Stop 
    </vaadin-button> 
    <vaadin-button theme="primary" id="pauseButton">
      Pause 
    </vaadin-button> 
    <vaadin-button theme="primary" id="playButton">
      Play 
    </vaadin-button> 
    <vaadin-button theme="primary" id="forward5Button">
      Forward 5 sec 
    </vaadin-button> 
   </vaadin-horizontal-layout> 
   <vaadin-horizontal-layout theme="margin" style="width: 100%; height: 100%;"> 
    <slider-with-caption id="volumeSlider" style="width: 250px" caption="Volume" value="1" max="10" step="0.1"></slider-with-caption> 
    <slider-with-caption id="leftGainSlider" style="width: 250px" caption="L" value="1" max="10" step="0.1"></slider-with-caption> 
    <slider-with-caption id="rightGainSlider" style="width: 250px" caption="R" value="1" max="10" step="0.1"></slider-with-caption> 
    <slider-with-caption id="balanceSlider" style="width: 250px" min="-1" caption="Balance" value="0" max="1" step="0.1"></slider-with-caption> 
    <slider-with-caption id="speedSlider" style="width: 250px" min="0.5" caption="Speed" value="1" max="3" step="0.1"></slider-with-caption> 
   </vaadin-horizontal-layout> 
   <div style="display: flex; align-items: center; justify-content: flex-end;"> 
    <div class="margin">
      [[playerStatus]] 
    </div> 
    <div class="margin">
      [[streamStatus]] 
    </div> 
    <vaadin-button theme="error" id="deleteButton" class="margin">
      Delete stream 
    </vaadin-button> 
   </div> 
`;
  }

  static get is() {
      return 'player-controls';
  }

  static get properties() {
      return {
          playerStatus: {
              type: String,
              value: ''
          },
          streamStatus: {
              type: String,
              value: ''
          },
          streamName: {
              type: String,
              value: ''
          },
          time: {
              type: String,
              value: '00:00 / 00:00'
          }
      };
  }
}

customElements.define(PlayerControls.is, PlayerControls);

