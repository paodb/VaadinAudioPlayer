import '@polymer/polymer/polymer-legacy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class SliderWithCaption extends PolymerElement {
  static get template() {
    return html`
   <style>
            :host {
                display: block;
            }
        </style> [[caption]] 
   <paper-slider id="slider" style="width: 100%" pin="" value="{{value}}" min="[[min]]" max="[[max]]" step="[[step]]"></paper-slider> 
`;
  }

  static get is() {
      return 'slider-with-caption';
  }

  static get properties() {
      return {
          caption: {
              type: String,
              value: 'caption'
          },
          value: {
              type: Number,
              value: 80,
              notify: true
          },
          min: {
              type: Number,
              value: 0
          },
          max: {
              type: Number,
              value: 100
          },
          step: {
              type: Number,
              value: 1
          }
      };
  }
}

customElements.define(SliderWithCaption.is, SliderWithCaption);

