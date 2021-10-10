import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

export default class ColumnItemView {

  #categoryId;
  #ROOT;
  #INPUT_VALUE;
  #INPUT_KEY;

  constructor(column, {count, categoryId, hasChild, label}, selectedCategoryIds) {
    // console.log(selectedCategoryIds, label);
    // console.log(categoryId);

    this.#categoryId = categoryId;

    // make HTML
    this.#ROOT = document.createElement('tr');
    this.#ROOT.classList.add('item');
    if (hasChild) this.#ROOT.classList.add('-haschild');
    this.#ROOT.dataset.id = categoryId;
    this.#ROOT.dataset.count = count;
    this.#ROOT.innerHTML = `
    <td class="label">
      <label class="key">
        <input type="checkbox" value="${categoryId}"/>
        ${label}
      </label>
      <label class="value">
        <input type="checkbox" value="${categoryId}"/>
        ${label}
      </label>
    </td>
    <td class="total">${count.toLocaleString()}</td>
    <td class="mapped"></td>
    <td class="pvalue"></td>
    <td class="drilldown"></td>`;

    this.#INPUT_VALUE = this.#ROOT.querySelector(':scope > td.label > label.value > input');
    this.#INPUT_KEY = this.#ROOT.querySelector(':scope > td.label > label.key > input');

    // even listener
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, ({detail}) => {
      console.log(detail)
      if (column.propertyId === detail.propertyId && categoryId === detail.categoryId) {
        this.#INPUT_VALUE.checked = detail.action === 'add';
      }
    });

    // select/deselect a item (attribute) > label
    this.#INPUT_VALUE.addEventListener('click', column.checkValue.bind(column));

    // drill down
    if (hasChild) {
      const drilldown = this.#ROOT.querySelector(':scope > .drilldown');
      drilldown.addEventListener('click', column.drillDown.bind(column));
    }

    if (selectedCategoryIds.indexOf(categoryId) !== -1) {
      this.#INPUT_VALUE.checked = true;
    }
  }

  get rootNode() {
    return this.#ROOT;
  }

}