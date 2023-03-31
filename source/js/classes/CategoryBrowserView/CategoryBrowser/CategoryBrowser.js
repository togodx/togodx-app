import {LitElement, html, nothing} from 'lit';
import {styles} from './CategoryBrowser.css';

export class CategoryBrowser extends LitElement {
  #showLoader = false;

  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      data: {type: Object, state: true},
      loading: {type: Boolean, state: true},
      error: {type: Object, state: true},
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
  }

  willUpdate(changed) {
    if (changed.has('data')) {
      console.log({data: this.data});
    }
  }

  render() {
    return html`
      <div class="container">
        ${this.loading && this.#showLoader
          ? html` <div part="loader" class="loader></div>`
          : nothing}
        ${this.error.isError
          ? html`
              <category-error message="${this.error.message}"> </category-error>
            `
          : nothing}
        <category-browser-columns
          .data="${this.data}"
        ></category-browser-columns>
      </div>
    `;
  }
}

customElements.define('category-browser', CategoryBrowser);
