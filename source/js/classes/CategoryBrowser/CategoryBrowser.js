import {LitElement, html, css, nothing} from 'lit';

// import loaderPNG from 'togostanza-utils/spinner.png';

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
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 5px;
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
      diseaseId: {
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
    this.diseaseId = '';
    //this.apiEndpoint = '';
    this.error = {message: '', isError: false};
    this.showKeys = ['node', 'label'];
    this.activeNode = {};
    this.API = new cachedAxios();

    element.append(this);
  }

  // updateParams(params) {
  //   try {

  //     this.error = {message: '', isError: false};

  //     this.diseaseId = this.initialId;
  //   } catch (error) {
  //     this.error = {message: error.message, isError: true};
  //   }
  // }

  get url() {
    return this.#apiURL.toString();
  }

  #loadData() {
    console.log('loading data with ', this.url);
    this.API.post(this.url)
      .then(({data}) => {
        this.data = {
          role: this.clickedRole,
          ...this.#getDataObject(data),
        };

        console.log('loaded data', data);

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
    if (changed.has('diseaseId') && this.diseaseId) {
      this.#apiURL.searchParams.set('node', this.diseaseId);
      this.error = {message: '', isError: false};
      this.#loadData();
    }
  }

  firstUpdated() {
    this.#loadingStarted();
    this.#loadData();
  }

  #getDataObject(incomingData) {
    //validate

    console.log('incomingData', incomingData);
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

  #getURL(id) {
    return this.apiEndpoint.replace('<>', id);
  }

  #changeDiseaseEventHadnler(e) {
    e.stopPropagation();
    this.diseaseId = e.detail.id;
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
