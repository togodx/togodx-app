import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilder from "./ConditionBuilder";
import * as event from '../events';

export default class ColumnItemView {

  #ROOT;
  #INPUT_VALUE;
  #INPUT_KEY;

  constructor(column, {count, categoryId, hasChild, label}, selectedCategoryIds) {

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
    if (selectedCategoryIds.keys.indexOf(categoryId) !== -1) this.#INPUT_KEY.checked = true;
    if (selectedCategoryIds.values.indexOf(categoryId) !== -1) this.#INPUT_VALUE.checked = true;

    // even listener
    this.#INPUT_KEY.addEventListener('change', e => {
      if (e.target.checked) {
        ConditionBuilder.addProperty(column.propertyId, categoryId);
      } else {
        ConditionBuilder.removeProperty(column.propertyId, categoryId);
      }
    });
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, ({detail}) => {
      if (detail.action === 'remove') {
        if (column.propertyId === detail.propertyId) {
          if (detail.parentCategoryId && categoryId === detail.parentCategoryId) {
            this.#INPUT_KEY.checked = detail.action === 'add';
          }
        }
      }
    });
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, ({detail}) => {
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

  }

  get rootNode() {
    return this.#ROOT;
  }

}