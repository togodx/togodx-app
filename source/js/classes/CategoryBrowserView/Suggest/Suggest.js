import {html, LitElement, nothing} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {scrollMeUp} from './scrollMeUp';
import {createRef, ref} from 'lit/directives/ref.js';

export class Suggest extends LitElement {
  #inputRef = createRef();

  constructor() {
    super();
    this.suggestions = [];
    this.selected = 0;
    this.show = false;
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
    this.dispatchEvent(
      new CustomEvent('suggestion-input', {
        detail: {
          term: e.target.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  #handleFocus() {
    this.show = true;
  }

  #hideSuggestions() {
    this.show = false;
    this.selected = 0;
  }

  #handleSelectSuggestion(suggestion) {
    this.dispatchEvent(
      new CustomEvent('suggestion-select', {
        detail: {
          id: suggestion.node,
        },
        bubbles: true,
        composed: true,
      })
    );
    this.#inputRef.value.value = '';
    this.suggestions = [];
    this.#hideSuggestions();
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
        this.#hideSuggestions();
        break;
      default:
        break;
    }
  }

  willUpdate(changed) {
    if (changed.has('suggestions')) {
      this.selected = 0;
      this.show = this.suggestions.length > 0;
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="input-container">
          <input
            type="text"
            @input=${this.#handleInput}
            @keydown=${this.#handleKeyDown}
            @focusout="${this.#hideSuggestions}"
            @focusin=${this.#handleFocus}
            @click=${this.#handleFocus}
            ${ref(this.#inputRef)}
            class="${this.show && this.suggestions.length > 0
              ? '-suggestions-shown'
              : ''}"
          />
          <div class="material-icons">search</div>
        </div>

        ${this.show && this.suggestions.length > 0
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
                      @mousedown=${() =>
                        this.#handleSelectSuggestion(suggestion)}
                      ${scrollMeUp(this.selected === index)}
                    >
                      <span> ${suggestion.label} </span>
                    </li>
                  `;
                }
              )}
            </ul>`
          : nothing}
      </div>
    `;
  }
  createRenderRoot() {
    return this;
  }
}
customElements.define('suggest-element', Suggest);
