import {LitElement, html} from 'lit';

import {styles} from './CategoryBrowserSorter.css';
import {observeState} from 'lit-element-state';
import {state} from '../CategoryBrowserState';

export class CategoryBrowserSorter extends observeState(LitElement) {
  #currentOrderOptionIndex = 0;

  static get properties() {
    return {
      order: {type: String, state: true},
      prop: {type: String, attribute: true},
      label: {type: String, attribute: true},
    };
  }

  static get styles() {
    return styles;
  }

  constructor() {
    super();
    this.prop = '';
    this.label = '';
    this.order = state.sortOrderOptions[0].value;
  }

  #handleSortChange() {
    this.#currentOrderOptionIndex =
      (this.#currentOrderOptionIndex + 1) % state.sortOrderOptions.length;

    state.sortOrder =
      state.sortOrderOptions[this.#currentOrderOptionIndex].value;
    state.sortProp = this.prop;
  }

  render() {
    return html`
      <div class="column-sorter-container" @click=${this.#handleSortChange}>
        ${this.label}
        <div
          class="sorter -${state.sortOrder !== 'none' ? state.sortOrder : ''}"
        ></div>
      </div>
    `;
  }
}

customElements.define('category-browser-sorter', CategoryBrowserSorter);
