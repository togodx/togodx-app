import {LitElement, html} from 'lit';

import {styles} from './CategoryBrowserSorter.css';
import {ref, createRef} from 'lit/directives/ref.js';

export class CategoryBrowserSorter extends LitElement {
  #sortOrderOprions = [
    {value: 'none', label: 'None'},
    {value: 'asc', label: 'Ascending'},
    {value: 'desc', label: 'Descending'},
  ];
  #currentOrderOptionIndex = 0;
  #containterRef = createRef();

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
    this.order = this.#sortOrderOprions[this.#currentOrderOptionIndex].value;
  }

  #handleSortChange() {
    this.#currentOrderOptionIndex =
      (this.#currentOrderOptionIndex + 1) % this.#sortOrderOprions.length;
    this.order = this.#sortOrderOprions[this.#currentOrderOptionIndex].value;
    this.dispatchEvent(
      new CustomEvent('category-sort-change', {
        detail: {
          property: this.prop,
          order: this.order,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div
        class="column-sorter-container"
        @click=${this.#handleSortChange}
        ${ref(this.#containterRef)}
      >
        ${this.label}
        <div class="sorter -${this.order ? this.order : ''}"></div>
      </div>
    `;
  }
}

customElements.define('category-browser-sorter', CategoryBrowserSorter);
