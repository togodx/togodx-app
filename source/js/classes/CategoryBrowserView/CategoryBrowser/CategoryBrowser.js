import {LitElement, html, nothing} from 'lit';
import {styles} from './CategoryBrowser.css';

export class CategoryBrowser extends LitElement {
  #showLoader = false;
  #sortOrderOprions = [
    {value: 'none', label: 'None'},
    {value: 'asc', label: 'Ascending'},
    {value: 'desc', label: 'Descending'},
  ];
  #currentOrderOptionIndex = 0;

  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      data: {type: Object, state: true},
      loading: {type: Boolean, state: true},
      error: {type: Object, state: true},
      checkedIds: {type: Array, state: true},
      sortOrder: {type: String, state: true},
      sortProp: {type: String, state: true},
      showKeys: {
        type: Array,
        state: true,
      },
    };
  }

  constructor() {
    super();
    this.data = {};
    this.loading = false;
    this.error = {message: '', isError: false};
    this.showKeys = ['node', 'label'];
    this.checkedIds = [];
    this.sortOrder =
      this.#sortOrderOprions[this.#currentOrderOptionIndex].value;
    this.sortProp = '';
  }

  render() {
    return html`
      <div class="container">
        ${this.loading && this.#showLoader
          ? html` <div part="loader" class="loader"></div>`
          : nothing}
        ${this.error.isError
          ? html`
              <category-error message="${this.error.message}"> </category-error>
            `
          : nothing}
        <category-browser-columns
          .checkedIds="${this.checkedIds}"
          .data="${this.data}"
          .sortOrder="${this.sortOrder}"
          .sortProp="${this.sortProp}"
        ></category-browser-columns>
      </div>
    `;
  }
}

customElements.define('category-browser', CategoryBrowser);
