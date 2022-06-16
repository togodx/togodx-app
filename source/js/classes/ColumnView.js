import ColumnItemView from "./ColumnItemView";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import ColumnSelectorSortManager from "./ColumnSelectorSortManager";
import App from "./App";
import Records from "./Records";
import * as event from '../events';
import {getApiParameter} from '../functions/queryTemplates';
// import * as queryTemplates from '../functions/queryTemplates';
import axios from "axios";

export default class ColumnView {

  #depth;
  #selector;
  #max;
  #parentNode;
  #columnItemViews;
  #cachedUserFilters;
  #ROOT;
  #TBODY;

  constructor(selector, filters, depth, parentNode) {

    // set members
    this.#depth = depth;
    this.#selector = selector;
    this.#parentNode = parentNode;
    this.#cachedUserFilters = new Map();

    // draw
    this.#draw(filters);

    // even listener
    DefaultEventEmitter.addEventListener(event.changeViewModes, this.#update.bind(this));
    DefaultEventEmitter.addEventListener(event.changeColumnSelectorSorter, this.#update.bind(this));
    this.#ROOT.addEventListener(event.collapsed, e => {
      if (e.detail) this.#update();
    })
  }

  #draw(filters) {

    // make column
    this.#ROOT = document.createElement('div');
    this.#ROOT.classList.add('column');
    this.#ROOT.dataset.capturingCollapse = true;
    this.#ROOT.dataset.parentNode = this.#parentNode ?? '';
    this.#max = 0;
    this.#ROOT.innerHTML = `
    <table>
      <thead>
        <tr class="header">
          <th class="label">Values</th>
          <th class="total">Total</th>
          <th class="mapped">Mapped</th>
          <th class="pvalue">p-value</th>
          <th class="drilldown"></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>`;
    this.#TBODY = this.#ROOT.querySelector(':scope > table > tbody');
    const selectedNodes = ConditionBuilder.getSelectedNodes(this.attributeId);
    this.#columnItemViews = filters.map((filter, index) => {
      this.#max = Math.max(this.#max, filter.count);
      // add item
      const columnItemView = new ColumnItemView(this, filter, index, selectedNodes);
      this.#TBODY.append(columnItemView.rootNode);
      return columnItemView;
    });

    // attach sort function
    const theadCells = Array.from(this.#ROOT.querySelectorAll(':scope > table > thead > tr > th'));
    ColumnSelectorSortManager.sortableColumns.forEach(sortableColumn => {
      const cell = theadCells.find(cell => cell.classList.contains(sortableColumn));
      cell.classList.add('-sortable');
      cell.insertAdjacentHTML('beforeend', `<div class="sorter" data-column="${sortableColumn}"></div>`);
    });
    this.#ROOT.querySelectorAll(':scope > table > thead > tr > .-sortable').forEach(sortable => {
      sortable.addEventListener('click', ({target}) => {
        const sorter = target.querySelector(':scope > .sorter');
        ColumnSelectorSortManager.setSort(sorter.dataset.column);
      });
    });
  }

  #update() {
    if (this.#selector.isShowing && this.#existed) {
      this.#sort();
      this.#heatmap();
    }
  }

  #sort() {
    const sortDescriptor = ColumnSelectorSortManager.sortDescriptor;
    // sorted by 'label' or 'total (= count)'
    const column = {
      '': 'index',
      label: 'label',
      total: 'count'
    }[sortDescriptor.column];
    const items = this.#columnItemViews.map(columnItemView => {
      return {
        index: columnItemView.index,
        filter: columnItemView[column]
      }
    });
    switch(sortDescriptor.column) {
      case 'label':
        items.sort((a, b) => a.filter > b.filter ? 1 : -1);
        break;
      case 'total':
        items.sort((a, b) => b.filter - a.filter);
        break;
    }
    if (sortDescriptor.direction === 'desc') items.reverse();
    // replace
    items.forEach(item => {
      this.#TBODY.append(this.#columnItemViews[item.index].rootNode);
    });
  }

  #heatmap() {
    const isLog10 = App.viewModes.log10;
    let max = isLog10 && this.#max > 1 ? Math.log10(this.#max) : this.#max;
    const category = Records.getCatexxxgoryWithAttributeId(this.attributeId);
    this.#columnItemViews.forEach(columnItemView => {
      columnItemView.update(category.color, isLog10, max);
    });
  }

  #getUserFilters(attribute, node) {
    return new Promise((resolve, reject) => {
      const parameter = getApiParameter('locate', {
        attribute,
        node,
        dataset: ConditionBuilder.currentDataset,
        queries: ConditionBuilder.userIds
      });
      const filters = this.#cachedUserFilters.get(parameter);
      if (filters) {
        resolve(filters);
      } else {
        axios
          .post(App.getApiUrl('locate'), parameter)
          .then(response => {
            this.#cachedUserFilters.set(parameter, response.data);
            resolve(response.data);
          });
      }
    });
  }


  // public Methods

  appended() {
    this.#update();

    // user IDs
    if (document.body.classList.contains('-showuserids') && ConditionBuilder.userIds.length > 0) {
      this.#getUserFilters(this.#selector.attributeId, this.#parentNode)
        .then(filters => {
          console.log(filters)
          this.#columnItemViews.forEach(columnItemView => columnItemView.setUserFilters(filters));
        });
    }
  }

  checkFilter(e) {
    e.stopPropagation();
    const checkbox = e.target;
    const ancestors = [];
    let parentNode;
    let column = checkbox.closest('.column');
    do { // find ancestors
      parentNode = column?.dataset.parentNode;
      if (parentNode) {
        ancestors.unshift(parentNode);
        column = column.previousElementSibling;
      }
    } while (parentNode);
    if (checkbox.checked) { // add
      ConditionBuilder.addFilter(
        this.attributeId,
        checkbox.value,
        ancestors
      );
    } else { // remove
      ConditionBuilder.removeFilter(this.attributeId, checkbox.value);
    }
  }

  // checkKey(e) {
  // }

  drillDown(e) {
    const itemNode = e.target.closest('tr');
    itemNode.classList.add('-selected');
    this.#selector.drillDown(itemNode.dataset.id, this.#depth);
  }


  // accessors

  get #existed() {
    return this.#ROOT.parentNode !== null;
  }

  get depth() {
    return this.#depth;
  }

  get attributeId() {
    return this.#selector.attributeId;
  }

  get parentNode() {
    return this.#parentNode;
  }

  get rootNode() {
    return this.#ROOT;
  }

}
