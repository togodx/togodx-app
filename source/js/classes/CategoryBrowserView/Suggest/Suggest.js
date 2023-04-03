import {html, LitElement, nothing} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {styles} from './Suggest.css';
import {scrollMeUp} from './scrollMeUp';

export class Suggest extends LitElement {
  #term = '';

  constructor() {
    super();
    this.suggestions = [];
    this.selected = 0;
    this.show = true;
    this._id = '';
    this.attribute = {};
  }

  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      suggestions: {type: Array, state: true},
      selected: {type: Number, state: true},
      loading: {type: Boolean, state: true},
      show: {type: Boolean, state: true},
    };
  }

  #handleInput(e) {
    this.#term = e.target.value;
    if (this.#term.length > 2) {
      this.dispatchEvent(
        new CustomEvent('suggest-input', {
          detail: {
            term: this.#term,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  willUpdate(changed) {
    if (changed.has('suggestions')) {
      this.selected = 0;
      console.log('this.suggestions.length', this.suggestions.length);
    }
  }
  w;

  render() {
    return html`
      <div class="container">
        <div class="input-container">
          <input
            type="text"
            @input=${this.#handleInput}
            @keydown=${this.#handleKeyDown}
          />
        </div>

        ${this.suggestions.length && this.show
          ? html` <ul class="suggestions">
              ${repeat(
                this.suggestions,
                suggestion => suggestion.node,
                (suggestion, index) => {
                  return html`
                    <li
                      class="suggestion ${index === this.selected
                        ? '-selected'
                        : ''}"
                      @click=${() => this.#handleSelectSuggestion(suggestion)}
                      ${scrollMeUp(this.selected === index)}
                    >
                      ${suggestion.label}
                    </li>
                  `;
                }
              )}
            </ul>`
          : nothing}
      </div>
    `;
  }

  #handleSelectSuggestion(suggestion) {
    this.dispatchEvent(
      new CustomEvent('suggestion-select', {
        detail: {
          id: suggestion.node, // TODO check if "node" or "id" ?
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  #selectNext() {
    if (this.selected < this.suggestions.length - 1) {
      this.selected++;
    } else {
      this.selected = 0;
    }
  }

  #selectPrev() {
    if (this.selected > 0) {
      this.selected--;
    } else {
      this.selected = this.suggestions.length - 1;
    }
  }

  #selectCurrent() {
    this.#handleSelectSuggestion(this.suggestions[this.selected]);
  }

  #handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':
        this.#selectNext();
        break;
      case 'ArrowUp':
        this.#selectPrev();
        break;
      case 'Enter':
        this.#selectCurrent();
        break;
      case 'Escape':
        this.show = false;
        break;
      default:
        break;
    }
  }
}
customElements.define('suggest-element', Suggest);
