import {LitElement, html, nothing} from 'lit';
import {styles} from './CategoryBrowser.css';

import {cachedAxios} from '../../../functions/util';

export class CategoryBrowser extends LitElement {
  #apiURL;
  #timer;

  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      attribute: {type: Object, state: true},

      nodeId: {
        type: String,
        reflect: true,
      },
      data: {state: true},
      loading: {type: Boolean, state: true},
      error: {type: Object, state: true},
      clickedRole: {
        type: String,
        status: true,
      },
      apiEndPoint: {
        type: String,
        state: true,
      },
      showKeys: {
        type: Array,
        state: true,
      },
      activeNode: {
        type: Object,
        state: true,
      },
    };
  }

  constructor() {
    // searchApiUrl
    super();
    this.#timer = null;

    this.data = {};
    this.loading = false;
    this.clickedRole = undefined;
    this.nodeId = '';
    this.error = {message: '', isError: false};
    this.showKeys = ['node', 'label'];
    this.activeNode = {};
    this.API = new cachedAxios();
  }

  get url() {
    return this.#apiURL.toString();
  }

  #loadData() {
    this.API.post(this.url)
      .then(({data}) => {
        this.data = {
          role: this.clickedRole,
          ...this.#getDataObject(data),
        };

        this.activeNode = {
          id: this.data.details.node,
          label: this.data.details.label,
        };
      })
      .catch(e => {
        console.error(e);
        this.error = {message: e.message, isError: true};
      })
      .finally(() => {
        this.#loadingEnded();
      });
  }

  willUpdate(changed) {
    if (changed.has('attribute') && this.attribute?.api) {
      this.#apiURL = new URL(this.attribute.api + '?hierarchy');
    }

    if (changed.has('nodeId') && this.nodeId) {
      this.#apiURL.searchParams.set('node', this.nodeId);
      this.error = {message: '', isError: false};
      this.#loadData();
    }
  }

  firstUpdated() {
    this.#loadingStarted();
    this.#loadData();
    this.id = 'category-browser';
  }

  #getDataObject(incomingData) {
    const nodeIdVal = incomingData.self.node;

    const nodeLabelVal = incomingData.self.label;

    const childrenArr = incomingData.children ?? [];

    const parentsArr = incomingData.parents ?? [];

    return {
      details: {
        ...incomingData.self,
        id: nodeIdVal,
        label: nodeLabelVal,
        showDetailsKeys: this.showKeys,
      },
      relations: {
        children: childrenArr.map(item => ({
          ...item,
          id: item.node,
          label: item.label,
        })),
        parents: parentsArr.map(item => ({
          ...item,
          id: item.node,
          label: item.label,
        })),
      },
    };
  }

  #handleNodeClicked(e) {
    e.stopPropagation();
    this.nodeId = e.detail.id;
    this.clickedRole = e.detail.role;
    this.#loadingStarted();

    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent('category-node-changed', {
          // here we can pass any data to the event through this.data
          detail: {
            id: e.detail.id,
            label: e.detail.label,
            ...this.data,
          },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  #loadingStarted() {
    this.#timer = setTimeout(() => {
      this.loading = true;
    }, 200);
  }

  #loadingEnded() {
    this.loading = false;
    if (this.#timer) {
      clearInterval(this.#timer);
      this.#timer = null;
    }
  }

  #handleNodeChecked(e) {
    console.log('node checked', e.detail);
  }

  render() {
    return html`
      <div class="container">
        ${this.loading
          ? html` <div part="loader" class="loader></div>`
          : nothing}
        ${this.error.isError
          ? html`
              <category-error message="${this.error.message}"> </category-error>
            `
          : nothing}
        <category-browser-columns
          .data=${this.data}
          @node-clicked="${this.#handleNodeClicked}"
          @node-checked="${this.#handleNodeChecked}"
        ></category-browser-columns>
      </div>
    `;
  }
}

customElements.define('category-browser', CategoryBrowser);
