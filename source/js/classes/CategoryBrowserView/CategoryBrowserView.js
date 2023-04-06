import {css, html, LitElement} from 'lit';
import {cachedAxios} from '../../functions/util';
import DefaultEventEmitter from '../DefaultEventEmitter';
import './Suggest/Suggest';
import './CategoryBrowser/CategoryBrowser';
import './CategoryBrowser/CategoryBrowserColumns';
import './CategoryBrowser/CategoryBrowserColumn';
import './CategoryBrowser/CategoryBrowserError';
import './CategoryBrowser/CategoryBrowserNode';
import {setUserFilters, clearUserFilters} from '../../events';

export class CategoryBrowserView extends LitElement {
  #items;
  #API = new cachedAxios();
  #categoryAPIBaseURL;
  #suggestAPIBaseURL;
  #clickedRole;
  #attributeId;
  #userFilterMap = new Map();

  constructor(element, attribute, items) {
    super();

    this.#attributeId = attribute.id;

    this.#suggestAPIBaseURL = new URL(
      attribute.api.replace('/breakdown/', '/suggest/')
    );
    this.#categoryAPIBaseURL = new URL(attribute.api + '?hierarchy');
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
          pvalue: this.#userFilterMap.has(item.node)
            ? this.#userFilterMap.get(item.node).pvalue
            : null,
        })),
        parents: parentsArr.map(item => ({
          ...item,
          id: item.node,
          label: item.label,
          pvalue: this.#userFilterMap.has(item.node)
            ? this.#userFilterMap.get(item.node).pvalue
            : null,
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
      this.suggestionsData = data.results.reduce((acc, curr) => {
        // check if the current item "node" is already in array
        const index = acc.findIndex(item => item.node === curr.node);
        // if not, add it to the array
        if (index === -1) {
          acc.push(curr);
        }
        return acc;
      }, []);
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
      <div class="container" id="category-browser-view" @>
        <div class="suggest">
          <suggest-element
            @suggestion-input="${debounce(this.#handleSuggestInput)}"
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

  createRenderRoot() {
    return this;
  }

  #handleSetUserFilters(e) {
    if (this.#attributeId === e.detail.attributeId) {
      this.#userFilterMap.clear();
      e.detail.filters.forEach(filter => {
        this.#userFilterMap.set(filter.node, filter);
      });

      this.categoryData = {
        role: this.#clickedRole,
        details: {
          ...this.categoryData.details,
          pvalue: this.#userFilterMap.has(this.categoryData.details.id)
            ? this.#userFilterMap.get(this.categoryData.details.id).pvalue
            : null,
          mapped: this.#userFilterMap.has(this.categoryData.details.id)
            ? this.#userFilterMap.get(this.categoryData.details.id).mapped
            : null,
        },
        relations: {
          children: this.categoryData.relations.children.map(item => ({
            ...item,
            pvalue: this.#userFilterMap.has(item.id)
              ? this.#userFilterMap.get(item.id).pvalue
              : null,
            mapped: this.#userFilterMap.has(item.id)
              ? this.#userFilterMap.get(item.id).mapped
              : null,
          })),
          parents: this.categoryData.relations.parents.map(item => ({
            ...item,
            pvalue: this.#userFilterMap.has(item.id)
              ? this.#userFilterMap.get(item.id).pvalue
              : null,
            mapped: this.#userFilterMap.has(item.id)
              ? this.#userFilterMap.get(item.id).mapped
              : null,
          })),
        },
      };

      console.log('category data', this.categoryData);
    }
  }

  #handleClearUserFilters(e) {
    this.#userFilterMap.clear();
    this.categoryData = {
      role: this.#clickedRole,
      details: {
        ...this.categoryData.details,
        pvalue: null,
        mapped: null,
      },
      relations: {
        children: this.categoryData.relations.children.map(item => ({
          ...item,
          pvalue: null,
          mapped: null,
        })),
        parents: this.categoryData.relations.parents.map(item => ({
          ...item,
          pvalue: null,
          mapped: null,
        })),
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    DefaultEventEmitter.addEventListener(
      setUserFilters,
      this.#handleSetUserFilters.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      clearUserFilters,
      this.#handleClearUserFilters.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    DefaultEventEmitter.removeEventListener(
      setUserFilters,
      this.#handleSetUserFilters.bind(this)
    );
    DefaultEventEmitter.removeEventListener(
      clearUserFilters,
      this.#handleClearUserFilters.bind(this)
    );
  }
}

customElements.define('category-browser-view', CategoryBrowserView);

export function debounce(func, ms = 300) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}
