import {css, html, LitElement} from 'lit';
import {cachedAxios, observable} from '../../functions/util';
import DefaultEventEmitter from '../DefaultEventEmitter';
import './Suggest/Suggest';
import './CategoryBrowser/CategoryBrowser';
import './CategoryBrowser/CategoryBrowserColumns';
import './CategoryBrowser/CategoryBrowserColumn';
import './CategoryBrowser/CategoryBrowserError';
import './CategoryBrowser/CategoryBrowserNode';
import {setUserFilters, clearUserFilters} from '../../events';
import App from '../App';
import Records from '../Records';
import ConditionAnnotation from '../ConditionAnnotation';
import * as event from '../../events';
import ConditionBuilder from '../ConditionBuilder';

//TODO add mutation observer to observe body's data-condition change
export class CategoryBrowserView extends LitElement {
  #items;
  #API = new cachedAxios();
  #categoryAPIBaseURL;
  #suggestAPIBaseURL;
  #clickedRole;
  #attributeId;
  #userFilterMap = new Map();
  #categoryColor;

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
    this.condition = document.body.dataset.condition;
    this.checkedIds = {filter: [], annotation: []};

    observable.subscribe('mutation', this.#onBodyMutation.bind(this));
    element.append(this);
  }

  #onBodyMutation(event) {
    if (event.mutation.attributeName === 'data-condition') {
      this.condition = event.mutation.target.dataset.condition;
    }
  }

  #addLog10ToItems(categoryData) {
    return categoryData.map((item, index) => {
      item.countLog10 = item.count === 0 ? 0 : Math.log10(item.count);

      return item;
    });
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
      checkedIds: {type: Object, state: true},
      condition: {type: String, state: true},
    };
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

    // const color = this.#getColor(,) `rgb(${filter.baseColor.mix(App.colorSilver, 1 - (isLog10 ? filter.countLog10 : filter.count) / max).coords.map(cood => cood * 256).join(',')})`;

    const nodeIdVal = incomingData.self.node;

    const nodeLabelVal = incomingData.self.label;

    const childrenArr = incomingData.children;

    const parentsArr = incomingData.parents;

    const getColor = (datum, max) => {
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
    let action = '';

    switch (e.detail.checked) {
      case true:
        action = 'add';
        break;
      case false:
        action = 'remove';
        break;
    }

    if (this.condition === 'filter') {
      if (action === 'add') {
        ConditionBuilder.addFilter(this.#attributeId, e.detail.id);
      } else {
        ConditionBuilder.removeFilter(this.#attributeId, e.detail.id);
      }
    } else if (this.condition === 'annotation') {
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

  // load initial data
  firstUpdated() {
    this.#loadCategoryData();
  }

  render() {
    return html`
      <div class="container" id="category-browser-view">
        <div class="suggest">
          <div class="column-title-wrapper">
            <div class="column-title"><h3>Superclasses</h3></div>
          </div>
          <div class="column-title-wrapper">
            <div class="column-title">
              <h3>Concept</h3>
              <suggest-element
                @suggestion-input="${debounce(this.#handleSuggestInput)}"
                @suggestion-select="${this.#handleSuggestSelect}"
                .loading="${this.suggestionLoading}"
                .suggestions="${this.suggestionsData}"
                id="suggest"
              ></suggest-element>
            </div>
          </div>
          <div class="column-title-wrapper">
            <div class="column-title"><h3>Subclasses</h3></div>
          </div>
        </div>
        <div class="category-browser">
          <category-browser
            @node-clicked="${this.#handleNodeClick}"
            @node-checked="${this.#handleNodeCheck}"
            id="category-browser"
            .data="${this.categoryData}"
            .checkedIds="${this.checkedIds[this.condition]}"
          ></category-browser>
        </div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }

  /** When MappedIDs "Try", ann pvalue & mapped values to data */
  #handleSetUserFilters(e) {
    if (this.#attributeId === e.detail.attributeId) {
      this.#userFilterMap.clear();
      e.detail.filters.forEach(filter => {
        this.#userFilterMap.set(filter.node, filter);
      });

      observable.notify({
        type: 'userFiltersSet',
        userFiltersSet: true,
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
    }
  }

  /** When Mapped IDs are cleared */
  #handleClearUserFilters() {
    this.#userFilterMap.clear();
    observable.notify({type: 'userFiltersSet', userFiltersSet: false});
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

  // TODO here checked ids wont updating properly when we change the condition

  #handleAddRemoveFilter(e) {
    const {action, attributeId, node} = e.detail;

    if (attributeId === this.#attributeId) {
      console.log('handleAddRemoveFilter', e.detail);
      switch (action) {
        case 'add':
          this.checkedIds = {
            ...this.checkedIds,
            [this.condition]: [...this.checkedIds[this.condition], node],
          };

          break;
        case 'remove':
          this.checkedIds = {
            ...this.checkedIds,
            [this.condition]: this.checkedIds[this.condition].filter(
              id => id !== node
            ),
          };

          break;
      }
    }
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

    observable.unsubscribe(this.#onBodyMutation.bind(this));
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
