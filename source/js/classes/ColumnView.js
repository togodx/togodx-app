import ColumnItemView from "./ColumnItemView";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import ColumnSelectorSortManager from "./ColumnSelectorSortManager";
import App from "./App";
import Records from "./Records";
import * as event from '../events';
import * as queryTemplates from '../functions/queryTemplates';

export default class ColumnView {

  #depth;
  #selector;
  #max;
  #parentCategoryId;
  #items;
  #cachedUserValues;
  #ROOT;

  constructor(
    selector,
    values,
    depth,
    parentCategoryId
  ) {

    // set members
    this.#depth = depth;
    this.#selector = selector;
    this.#parentCategoryId = parentCategoryId;
    this.#cachedUserValues = new Map();

    // draw
    this.#draw(values);
    this.#update(App.viewModes.log10);

    // even listener
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update(e.detail.log10));
    DefaultEventEmitter.addEventListener(event.changeColumnSelectorSorter, this.#sort.bind(this));
  }

  #draw(values) {

    // make column
    this.#ROOT = document.createElement('div');
    this.#ROOT.classList.add('column');
    this.#ROOT.dataset.parentCategoryId = this.#parentCategoryId ?? '';
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
    const tbody = this.#ROOT.querySelector(':scope > table > tbody');
    const selectedCategoryIds = ConditionBuilder.getSelectedCategoryIds(this.propertyId);
    this.#items = values.map(value => {
      this.#max = Math.max(this.#max, value.count);
      // add item
      const columnItemView = new ColumnItemView(this, value, selectedCategoryIds);
      tbody.append(columnItemView.rootNode);
      return columnItemView;
    });

    // sort
    const theadCells = Array.from(this.#ROOT.querySelectorAll(':scope > table > thead > tr > th'));
    ColumnSelectorSortManager.sortableColumns.forEach(sortableColumn => {
      const cell = theadCells.find(cell => cell.classList.contains(sortableColumn));
      cell.classList.add('-sortable');
      cell.insertAdjacentHTML('beforeend', `<div class="sorter" data-column="${sortableColumn}"></div>`);
    });
    this.#ROOT.querySelectorAll(':scope > table > thead > tr > .-sortable').forEach(sortable => {
      sortable.addEventListener('click', ({target}) => {
        const sorter = target.querySelector(':scope > .sorter');
        const customEvent = new CustomEvent(event.changeColumnSelectorSorter, {detail: {
          column: sorter.dataset.column
        }});
        DefaultEventEmitter.dispatchEvent(customEvent);
      });
    });
  }

  #update(isLog10) {
    let max = isLog10 && this.#max > 1 ? Math.log10(this.#max) : this.#max;
    this.#items.forEach(columnItemView => {
      const subject = Records.getSubjectWithPropertyId(this.propertyId);
      columnItemView.update(subject, isLog10, max);
    });
  }

  #getUserValues(query) {
    return new Promise((resolve, reject) => {
      const values = this.#cachedUserValues.get(query);
      if (values) {
        resolve(values);
      } else {
        axios
          .get(query)
          .then(response => {
            this.#cachedUserValues.set(query, response.data);
            resolve(response.data);
          });
      }
    });
  }

  #sort({detail: {column}}) {
    console.log(column)
  }


  // public Methods

  appended() {
    // TODO: これをきっかけに描画をするようにする
    // user IDs
    if (document.body.classList.contains('-showuserids') && ConditionBuilder.userIds) {
      this.#getUserValues(
        queryTemplates.dataFromUserIds(
          this.#selector.sparqlet,
          this.#selector.primaryKey,
          this.#parentCategoryId
          )
        )
        .then(values => {
          console.log(values)
          this.#items.forEach(columnItemView => columnItemView.setUserValues(values));
        });
    }
  }

  checkValue(e) {
    e.stopPropagation();
    const checkbox = e.target;
    const ancestors = [];
    let parentCategoryId;
    let column = checkbox.closest('.column');
    do { // find ancestors
      parentCategoryId = column?.dataset.parentCategoryId;
      if (parentCategoryId) {
        ancestors.unshift(parentCategoryId);
        column = column.previousElementSibling;
      }
    } while (parentCategoryId);
    if (checkbox.checked) { // add
      ConditionBuilder.addPropertyValue(
        this.propertyId,
        checkbox.value,
        ancestors
      );
    } else { // remove
      ConditionBuilder.removePropertyValue(this.propertyId, checkbox.value);
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

  get depth() {
    return this.#depth;
  }

  get propertyId() {
    return this.#selector.propertyId;
  }

  get parentCategoryId() {
    return this.#parentCategoryId;
  }

  get rootNode() {
    return this.#ROOT;
  }

}
