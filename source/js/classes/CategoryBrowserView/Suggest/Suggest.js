import {html, LitElement} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {styles} from './Suggest.css';

export class Suggest extends LitElement {
  constructor() {
    // Suggest API url
    super();
    this.suggestions = [];
    this.selected = 0;
    this.show = false;
    this._id = '';
  }

  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      suggestions: {type: Array, state: true},
      selected: {type: Number, state: true},
      show: {type: Boolean, state: true},
      _id: {type: String, state: true},
    };
  }

  render() {
    return html`
      <div class="container">
        <div class="suggestions">
          ${repeat(
            this.suggestions,
            suggestion => suggestion.id,
            (suggestion, index) => {
              return html`
                <div
                  class="suggestion ${index === this.selected
                    ? 'selected'
                    : ''}"
                  @click=${() => this._selectSuggestion(suggestion)}
                >
                  ${suggestion.label}
                </div>
              `;
            }
          )}
        </div>
      </div>
    `;
  }

  _selectSuggestion(suggestion) {
    this.dispatchEvent(
      new CustomEvent('select-suggestion', {
        detail: {
          id: this._id,
          suggestion: suggestion,
        },
      })
    );
  }

  _selectNext() {
    if (this.selected < this.suggestions.length - 1) {
      this.selected++;
    }
  }

  _selectPrev() {
    if (this.selected > 0) {
      this.selected--;
    }
  }

  _selectCurrent() {
    this._selectSuggestion(this.suggestions[this.selected]);
  }

  _keyDownHandler(e) {
    switch (e.key) {
      case 'ArrowDown':
        this._selectNext();
        break;
      case 'ArrowUp':
        this._selectPrev();
        break;
      case 'Enter':
        this._selectCurrent();
        break;
      case 'Escape':
        this.show = false;
        break;
      default:
        break;
    }
  }

  firstUpdated() {
    this.addEventListener('keydown', e => this._keyDownHandler(e));
  }
}
customElements.define('suggest-element', Suggest);
