import {LitElement, html, css, nothing} from 'lit';

import {cachedAxios} from '../../functions/util';

import './CategoryBrowserView';
import './CategoryBrowserError';

export class CategoryBrowser extends LitElement {
  #attribute;
  #apiURL;
  #timer;
  #items;

  static get styles() {
    return css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
        inset: 0;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 5px;
        height: 100%;
      }

      .spinner {
        z-index: 10;
        position: absolute;
        width: 100%;
        height: 100%;
      }

      ontology-error {
        z-index: 11;
      }

      .spinner > img {
        display: block;
        width: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `;
  }

  static get properties() {
    return {
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

  constructor(element, attribute, items) {
    super();
    this.#timer = null;
    this.#attribute = attribute;
    this.#items = items;

    this.#apiURL = new URL(attribute.api + '?hierarchy');

    this.data = {};
    this.loading = false;
    this.clickedRole = undefined;
    this.nodeId = '';
    this.error = {message: '', isError: false};
    this.showKeys = ['node', 'label'];
    this.activeNode = {};
    this.API = new cachedAxios();

    element.append(this);
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
    if (changed.has('nodeId') && this.nodeId) {
      this.#apiURL.searchParams.set('node', this.nodeId);
      this.error = {message: '', isError: false};
      this.#loadData();
    }
  }

  firstUpdated() {
    this.#loadingStarted();
    this.#loadData();
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

  #changeDiseaseEventHadnler(e) {
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

  render() {
    return html`
      <div class="container">
        ${this.loading
          ? html`<div class="loading-view -shown"></div>`
          : nothing}
        ${this.error.isError
          ? html`
              <category-error message="${this.error.message}"> </category-error>
            `
          : nothing}
        <category-browser-view
          .data=${this.data}
          @column-click="${this.#changeDiseaseEventHadnler}"
        ></category-browser-view>
      </div>
    `;
  }
}

customElements.define('category-browser', CategoryBrowser);
