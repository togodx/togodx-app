import {css, html, LitElement} from 'lit';
import {cachedAxios} from '../../functions/util';
import './Suggest/Suggest';
import './CategoryBrowser/CategoryBrowser';
import './CategoryBrowser/CategoryBrowserColumns';
import './CategoryBrowser/CategoryBrowserColumn';
import './CategoryBrowser/CategoryBrowserError';
import './CategoryBrowser/CategoryBrowserNode';

export class CategoryBrowserView extends LitElement {
  #items;
  #API = new cachedAxios();
  #categoryAPIBaseURL;
  #suggestAPIBaseURL;
  #clickedRole;

  constructor(element, attribute, items) {
    super();

    this.#suggestAPIBaseURL = new URL(
      attribute.api.replace('/breakdown/', '/suggest/')
    );
    this.#categoryAPIBaseURL = new URL(attribute.api + '?hierarchy');
    console.log('items', items);
    this.#items = items;

    this.categoryData = {};
    this.categoryLoading = false;
    this.suggestionsData = {};
    this.suggestionsLoading = false;
    this.url = '';
    this.nodeId = '';
    this.term = '';

    element.append(this);
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        inset: 0;
      }
      .container {
        display: flex;
        flex-direction: column;
        gap: 5px;
        height: 100%;
        padding: 5px;
      }

      .suggest {
        height: 20px;
      }
      .category-browser {
        position: relative;
        flex: 1;
      }
    `;
  }

  static get properties() {
    return {
      categoryData: {type: Object, state: true},
      suggestionsData: {type: Object, state: true},
      categoryLoading: {type: Boolean, state: true},
      suggestionsLoading: {type: Boolean, state: true},
      url: {type: String, state: true},
      nodeId: {type: String, state: true},
      term: {type: String, state: true},
    };
  }

  #convertCategoryData(incomingData) {
    const nodeIdVal = incomingData.self.node;

    const nodeLabelVal = incomingData.self.label;

    const childrenArr = incomingData.children ?? [];

    const parentsArr = incomingData.parents ?? [];

    return {
      role: this.#clickedRole,
      details: {
        ...incomingData.self,
        id: nodeIdVal,
        label: nodeLabelVal,
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

  willUpdate(changed) {
    if (changed.has('nodeId') && this.nodeId) {
      this.#loadCategoryData(this.nodeId);
    }
    if (changed.has('term') && this.term) {
      this.#loadSuggestData(this.term);
    }
  }

  #loadCategoryData(nodeId) {
    if (nodeId) {
      this.#categoryAPIBaseURL.searchParams.set('node', nodeId);
    }
    this.categoryLoading = true;
    this.#API.post(this.#categoryAPIBaseURL.href).then(({data}) => {
      this.categoryLoading = false;
      this.categoryData = this.#convertCategoryData(data);
    });
  }

  #loadSuggestData(term) {
    this.#suggestAPIBaseURL.searchParams.set('term', term);
    this.suggestionsLoading = true;
    this.#API.post(this.#suggestAPIBaseURL.href).then(({data}) => {
      this.suggestionsLoading = false;
      this.suggestionsData = data.results;
    });
  }

  #handleNodeClick(e) {
    this.nodeId = e.detail.id;
    this.#clickedRole = e.detail.role;
  }

  #handleNodeCheck(e) {
    console.log('node checked', e.detail);
  }

  #handleSuggestInput(e) {
    if (e.detail.term.length < 3) {
      this.suggestionsData = [];
    } else {
      this.term = e.detail.term;
      this.#loadSuggestData(this.term);
    }
  }

  #handleSuggestSelect(e) {
    this.nodeId = e.detail.id;
  }

  // load initial data
  firstUpdated() {
    this.url = this.#categoryAPIBaseURL.href;
    this.#loadCategoryData();
  }

  render() {
    return html`
      <div class="container">
        <div class="suggest">
          <suggest-element
            @suggestion-input="${this.#handleSuggestInput}"
            @suggestion-select="${this.#handleSuggestSelect}"
            .loading="${this.suggestionLoading}"
            .suggestions="${this.suggestionsData}"
            id="suggest"
          ></suggest-element>
        </div>
        <div class="category-browser">
          <category-browser
            @node-clicked="${this.#handleNodeClick}"
            @node-checked="${this.#handleNodeCheck}"
            id="category-browser"
            .items="${this.#items}"
            .data="${this.categoryData}"
          ></category-browser>
        </div>
      </div>
    `;
  }
}

customElements.define('category-browser-view', CategoryBrowserView);
