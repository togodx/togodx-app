import {LitElement, html} from 'lit';

import {styles} from './CategoryBrowserSorter.css';
import {ref, createRef} from 'lit/directives/ref.js';
import DefaultEventEmitter from '../../DefaultEventEmitter';
import {sortEvent, sortOrderConst} from './sortConst';

export class CategoryBrowserSorter extends LitElement {
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
    this.order = sortOrderConst.default;
  }

  #handleSortChange() {
    this.#currentOrderOptionIndex =
      (this.#currentOrderOptionIndex + 1) % sortOrderConst.length;
    const order = sortOrderConst[this.#currentOrderOptionIndex].value;
    this.dispatchEvent(
      new CustomEvent(sortEvent.sortChange, {
        detail: {
          property: this.prop,
          order,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  #handleOutsideSortChange(e) {
    const {property, order} = e.detail;
    if (property === this.prop) {
      this.order = order;
    } else {
      this.order = sortOrderConst.default.value;
    }
  }

  connectedCallback() {
    super.connectedCallback();

    DefaultEventEmitter.addEventListener(
      sortEvent.outsideSortChange,
      this.#handleOutsideSortChange.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    DefaultEventEmitter.removeEventListener(
      'sort-change',
      this.#handleOutsideSortChange.bind(this)
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
