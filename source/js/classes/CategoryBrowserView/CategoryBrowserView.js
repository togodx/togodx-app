import {html, LitElement, nothing} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {cachedAxios} from '../../functions/util.ts';
import DefaultEventEmitter from '../DefaultEventEmitter.ts';
import './Suggest/Suggest';
import './CategoryBrowser/CategoryBrowser';
import './CategoryBrowser/CategoryBrowserColumns';
import './CategoryBrowser/CategoryBrowserColumn';
import './CategoryBrowser/CategoryBrowserError';
import './CategoryBrowser/CategoryBrowserNode';
import './CategoryBrowser/CategoryBrowserSorter';
import './CategoryBrowser/CategoryBrowserLoader';
import {setUserFilters, clearUserFilters} from '../../events';
import App from '../App.ts';
import Records from '../Records.ts';
import ConditionAnnotation from '../ConditionAnnotationUtility.ts';
import * as event from '../../events';
import ConditionBuilder from '../ConditionBuilder.ts';
import {observeState} from 'lit-element-state';
import {state} from './CategoryBrowserState';

export class CategoryBrowserView extends observeState(LitElement) {
  #items;
  #rootNodeId = 'root';
  #API = new cachedAxios();
  #categoryAPIBaseURL;
  #suggestAPIBaseURL;
  #clickedRole;
  #attributeId;
  #userFilterMap = new Map();
  #categoryColor;
  #unsortedData = null;

  constructor(element, attribute, items) {
    super();

    this.#categoryColor = Records.getCategoryWithAttributeId(
      attribute.id
    ).color;

    this.#attributeId = attribute.id;
    this.#suggestAPIBaseURL = new URL(
      attribute.api.replace('/breakdown/', '/suggest/')
    );
    this.#categoryAPIBaseURL = new URL(attribute.api + '?hierarchy');

    this.categoryData = {};
    this.categoryLoading = false;
    this.suggestionsData = {};
    this.suggestionsLoading = false;
    this.nodeId = '';
    this.term = '';
    this.checkedIds = {filter: [], annotation: []};

    state.addObserver(this.#handleSortChange.bind(this), [
      'sortOrder',
      'sortProp',
    ]);

    element.append(this);
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
      checkedIds: {type: Object, state: true},
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

  // load initial data
  firstUpdated() {
    this.#loadCategoryData();
  }

  #addLog10ToItems(categoryData) {
    return categoryData.map((item, index) => {
      item.countLog10 = item.count === 0 ? 0 : Math.log10(item.count);

      return item;
    });
  }

  #convertCategoryData(incomingData) {
    const isLog10 = App.viewModes.log10;

    incomingData.self = this.#addLog10ToItems([incomingData.self])[0];

    incomingData.children = this.#addLog10ToItems([
      ...(incomingData.children ?? []),
    ]);
    incomingData.parents = this.#addLog10ToItems([
      ...(incomingData.parents ?? []),
    ]);

    if (incomingData.parents.length === 0) {
      state.rootNodeIds.add(incomingData.self.node);
    }

    let maxChildren = Math.max(
      ...incomingData.children.map(filter => filter.count)
    );
    let maxParents = Math.max(
      ...incomingData.parents.map(filter => filter.count)
    );

    maxChildren = isLog10 ? Math.log10(maxChildren) : maxChildren;
    maxParents = isLog10 ? Math.log10(maxParents) : maxParents;
    const maxSelf = isLog10
      ? Math.log10(incomingData.self.count)
      : incomingData.self.count;

    const nodeIdVal = incomingData.self.node;

    const nodeLabelVal = incomingData.self.label;

    const childrenArr = incomingData.children;

    const parentsArr = incomingData.parents;

    const getColor = (datum, max) => {
      if (datum.count === 0) {
        return App.colorGray.toString();
      }
      return `rgb(${this.#categoryColor
        .mix(
          App.colorWhite,
          1 - (isLog10 ? datum.countLog10 : datum.count) / max
        )
        .coords.map(coord => coord * 256)
        .join(',')})`;
    };

    return {
      role: this.#clickedRole,
      details: {
        ...incomingData.self,
        id: nodeIdVal,
        label: nodeLabelVal,
        color: getColor(incomingData.self, maxSelf),
      },
      relations: {
        children: childrenArr.map(item => ({
          ...item,
          id: item.node,
          label: item.label,
          color: getColor(item, maxChildren),
        })),
        parents: parentsArr.map(item => ({
          ...item,
          id: item.node,
          label: item.label,
          color: getColor(item, maxParents),
        })),
      },
    };
  }

  #resetToRootNode() {
    this.#loadCategoryData('root');
  }

  #loadCategoryData(nodeId) {
    if (nodeId && nodeId !== 'root') {
      this.#categoryAPIBaseURL.searchParams.set('node', nodeId);
    }
    if (nodeId === 'root') {
      this.#categoryAPIBaseURL.searchParams.delete('node');
    }

    this.categoryLoading = true;
    this.#API.post(this.#categoryAPIBaseURL.href).then(({data}) => {
      this.categoryLoading = false;
      this.#unsortedData = this.#convertCategoryData(data);
      this.#addMappedToData();
      this.categoryData = this.#unsortedData;
      if (!nodeId) {
        this.#rootNodeId = this.categoryData.details.id;
      }
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
    let action = '';

    switch (e.detail.checked) {
      case true:
        action = 'add';
        break;
      case false:
        action = 'remove';
        break;
    }

    if (state.condition === 'filter') {
      if (action === 'add') {
        ConditionBuilder.addFilter(this.#attributeId, e.detail.id);
      } else {
        ConditionBuilder.removeFilter(this.#attributeId, e.detail.id);
      }
    } else if (state.condition === 'annotation') {
      const conditionAnnotation = new ConditionAnnotation(
        this.#attributeId,
        e.detail.id
      );
      if (action === 'add') {
        ConditionBuilder.addAnnotation(conditionAnnotation);
      } else {
        ConditionBuilder.removeAnnotation(conditionAnnotation);
      }
    }
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

  #handleSortChange() {
    const children = this.#unsortedData.relations.children.slice();
    const parents = this.#unsortedData.relations.parents.slice();

    // sorting here but here there is no yet mapped
    switch (state.sortOrder) {
      case 'desc':
        this.categoryData = {
          ...this.#unsortedData,
          relations: {
            children: children.sort((a, b) => {
              return a[state.sortProp] < b[state.sortProp] ? 1 : -1;
            }),
            parents: parents.sort((a, b) => {
              return a[state.sortProp] < b[state.sortProp] ? 1 : -1;
            }),
          },
        };
        break;
      case 'asc':
        this.categoryData = {
          ...this.#unsortedData,
          relations: {
            children: children.sort((a, b) => {
              return a[state.sortProp] > b[state.sortProp] ? 1 : -1;
            }),
            parents: parents.sort((a, b) => {
              return a[state.sortProp] > b[state.sortProp] ? 1 : -1;
            }),
          },
        };
        break;

      default:
        this.categoryData = this.#unsortedData;
        break;
    }
  }

  #addMappedToData() {
    this.#unsortedData = {
      role: this.#clickedRole,

      details: {
        ...this.#unsortedData.details,
        pvalue: this.#userFilterMap.has(this.#unsortedData.details.id)
          ? this.#userFilterMap.get(this.#unsortedData.details.id).pvalue
          : null,
        mapped: this.#userFilterMap.has(this.#unsortedData.details.id)
          ? this.#userFilterMap.get(this.#unsortedData.details.id).mapped
          : null,
      },
      relations: {
        children: this.#unsortedData.relations.children.map(item => ({
          ...item,
          pvalue: this.#userFilterMap.has(item.id)
            ? this.#userFilterMap.get(item.id).pvalue
            : null,
          mapped: this.#userFilterMap.has(item.id)
            ? this.#userFilterMap.get(item.id).mapped
            : null,
        })),
        parents: this.#unsortedData.relations.parents.map(item => ({
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
  }

  /** When MappedIDs "Try", add pvalue & mapped values to data */
  #handleSetUserFilters(e) {
    if (this.#attributeId === e.detail.attributeId) {
      this.#userFilterMap.clear();
      e.detail.filters.forEach(filter => {
        this.#userFilterMap.set(filter.node, filter);
      });

      // this.#state.userFiltersSet = true;

      state.userFiltersSet = true;

      this.#addMappedToData();
      this.categoryData = this.#unsortedData;
    }
  }

  /** When Mapped IDs are cleared */
  #handleClearUserFilters() {
    this.#userFilterMap.clear();

    state.userFiltersSet = false;

    this.#unsortedData = {
      role: this.#clickedRole,
      details: {
        ...this.#unsortedData.details,
        pvalue: null,
        mapped: null,
      },
      relations: {
        children: this.#unsortedData.relations.children.map(item => ({
          ...item,
          pvalue: null,
          mapped: null,
        })),
        parents: this.#unsortedData.relations.parents.map(item => ({
          ...item,
          pvalue: null,
          mapped: null,
        })),
      },
    };

    this.categoryData = this.#unsortedData;
  }

  // TODO here checked ids wont updating properly when we change the condition

  #handleAddRemoveFilter(e) {
    const action = e.detail.action;
    const {attributeId, node} = (() => {
      switch (state.condition) {
        case 'filter':
          return {
            attributeId: e.detail.attributeId,
            node: e.detail.node,
          };
        case 'annotation':
          return {
            attributeId: e.detail.conditionUtilityAnnotation.attributeId,
            node: e.detail.conditionUtilityAnnotation.nodeId,
          };
      }
    })();

    if (attributeId === this.#attributeId) {
      switch (action) {
        case 'add':
          this.checkedIds = {
            ...this.checkedIds,
            [state.condition]: [...this.checkedIds[state.condition], node],
          };

          break;
        case 'remove':
          this.checkedIds = {
            ...this.checkedIds,
            [state.condition]: this.checkedIds[state.condition].filter(
              id => id !== node
            ),
          };

          break;
      }
    }
  }

  render() {
    return html`
      <div class="container" id="category-browser-view">
        <div
          class="columns-bg-wrapper ${state.editingCategory !== ''
            ? '-dark'
            : ''}"
        >
          ${repeat(
            [1, 2, 3],
            d => `${d}_${this.categoryLoading}`,
            () => html`
              <div class="columns-bg">
                ${this.categoryLoading
                  ? html`<category-loader id="category-browser-loader" />`
                  : nothing}
              </div>
            `
          )}
        </div>
        <div class="suggest">
          <div class="column-title-wrapper">
            <div class="column-title"><h3>Broader</h3></div>
          </div>
          <div class="column-title-wrapper">
            <div class="column-title">
              <h3>Term</h3>
              <suggest-element
                @suggestion-input="${debounce(this.#handleSuggestInput)}"
                @suggestion-select="${this.#handleSuggestSelect}"
                .loading="${this.suggestionLoading}"
                .suggestions="${this.suggestionsData}"
                id="suggest"
              ></suggest-element>
              <button
                class="rounded-button-view"
                ?disabled=${this.categoryLoading ||
                !this.nodeId ||
                this.nodeId === this.#rootNodeId}
                @click=${this.#resetToRootNode}
                title="Reset view to root node"
              >
                restart_alt
              </button>
            </div>
          </div>
          <div class="column-title-wrapper">
            <div class="column-title"><h3>Narrower</h3></div>
          </div>
        </div>
        <div class="category-browser">
          <category-browser
            @node-clicked="${this.#handleNodeClick}"
            @node-checked="${this.#handleNodeCheck}"
            id="category-browser"
            .data="${this.categoryData}"
            .checkedIds="${this.checkedIds[state.condition]}"
          ></category-browser>
        </div>
      </div>
    `;
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
    DefaultEventEmitter.addEventListener(
      event.mutateFilterCondition,
      this.#handleAddRemoveFilter.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      event.mutateAnnotationCondition,
      this.#handleAddRemoveFilter.bind(this)
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
    DefaultEventEmitter.removeEventListener(
      event.mutateFilterCondition,
      this.#handleAddRemoveFilter.bind(this)
    );
    DefaultEventEmitter.removeEventListener(
      event.mutateAnnotationCondition,
      this.#handleAddRemoveFilter.bind(this)
    );
  }

  createRenderRoot() {
    return this;
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
