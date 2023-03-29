import {LitElement, html, css, nothing} from 'lit';

// import loaderPNG from 'togostanza-utils/spinner.png';

import {applyConstructor, cachedAxios, getByPath} from '../utils.js';

import './OntologyBrowserOntologyView';
import './OntologyBrowserError';

export class OntologyBrowser extends LitElement {
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
      pathArray: {
        type: Array,
        state: true,
      },
      activeNode: {
        type: Object,
        state: true,
      },
    };
  }

  get #apiUrl() {
    return this.#attribute.obj.api + '?hierarchy';
  }

  constructor(element, attribute, items) {
    super();
    this.#timer = null;
    this.#attribute = attribute;
    this.#items = items;

    this.data = [];
    this.loading = false;
    this.clickedRole = undefined;
    this.diseaseId = undefined;
    //this.apiEndpoint = '';
    this.error = {message: '', isError: false};
    this.showKeys = ['id', 'label'];
    this.pathArray = [];
    this.activeNode = {};
    this.API = new cachedAxios();

    element.append(this);
  }

  updateParams(params) {
    try {
      this.#validateParams(params);

      applyConstructor.call(this, params);

      this.showKeys = this.nodeDetailsShowKeys
        ? this.nodeDetailsShowKeys.split(',').map(key => key.trim())
        : [];

      this.error = {message: '', isError: false};

      this.diseaseId = this.initialId;
    } catch (error) {
      this.error = {message: error.message, isError: true};
    }
  }

  #validateParams(params) {
    for (const key in params) {
      if (key === 'api-endpoint') {
        if (!params[key].includes('<>')) {
          throw new Error("Placeholder '<>' should be present in the API URL");
        }
      }
    }
  }

  #loadData() {
    this.API.post(this.#getURL(this.diseaseId))
      .then(({data}) => {
        this.data = {
          role: this.clickedRole,
          ...this.#getDataObject(data),
        };

        this.activeNode = {
          id: this.data.details.id,
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
    if (
      (changed.has('diseaseId') || changed.has('apiEndpoint')) &&
      this.diseaseId
    ) {
      this.error = {message: '', isError: false};
      this.#loadData();
    }
  }

  firstUpdated() {
    this.#loadingStarted();
    this.diseaseId = this.initialId;
  }

  #getDataObject(incomingData) {
    //validate
    const nodeIdVal = getByPath(incomingData, this.nodeIdPath); //TODO redo without getByPath
    if (!nodeIdVal) {
      throw new Error('Node id path is not valid');
    }
    const nodeLabelVal = getByPath(incomingData, this.nodeLabelPath); //TODO redo without getByPath
    if (!nodeLabelVal) {
      throw new Error('Node label path is not valid');
    }
    const childrenArr = getByPath(incomingData, this.nodeRelationsChildrenPath); //TODO redo without getByPath

    if (childrenArr instanceof Array) {
      if (childrenArr.length > 0) {
        if (!childrenArr.some(item => item[this.nodeRelationsIdKey])) {
          throw new Error('Path to node children id is not valid ');
        }
        if (!childrenArr.some(item => item[this.nodeRelationsLabelKey])) {
          throw new Error('Path to node children label is not valid ');
        }
      }
    } else {
      throw new Error('Path to node children is not valid ');
    }

    const parentsArr = getByPath(incomingData, this.nodeRelationsParentsPath);

    if (parentsArr instanceof Array) {
      if (parentsArr.length > 0) {
        if (!parentsArr.some(item => item[this.nodeRelationsIdKey])) {
          throw new Error('Path to node children id is not valid ');
        }
        if (!parentsArr.some(item => item[this.nodeRelationsLabelKey])) {
          throw new Error('Path to node children label is not valid ');
        }
      }
    } else {
      throw new Error('Path to node parents is not valid ');
    }

    return {
      details: {
        ...getByPath(incomingData, this.nodeDetailsPath),
        id: nodeIdVal,
        label: nodeLabelVal,
        showDetailsKeys: this.showKeys,
      },
      relations: {
        children: childrenArr.map(item => ({
          ...item,
          id: item[this.nodeRelationsIdKey],
          label: item[this.nodeRelationsLabelKey],
        })),
        parents: parentsArr.map(item => ({
          ...item,
          id: item[this.nodeRelationsIdKey],
          label: item[this.nodeRelationsLabelKey],
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
        new CustomEvent('ontology-node-changed', {
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
              <ontology-error message="${this.error.message}"> </ontology-error>
            `
          : nothing}
        <ontology-browser-view
          .data=${this.data}
          @column-click="${this.#changeDiseaseEventHadnler}"
        ></ontology-browser-view>
      </div>
    `;
  }
}

customElements.define('ontology-browser', OntologyBrowser);
