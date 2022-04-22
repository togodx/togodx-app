import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilder from "./ConditionBuilder";
import App from "./App";
import * as event from '../events';

export default class ColumnItemView {

  #label;
  #count;
  #node;
  #index;
  #ROOT;
  #INPUT_VALUE;
  #INPUT_KEY;

  constructor(column, {count, node, tip, label}, index, selectedCategoryIds) {

    this.#label = label;
    this.#count = count;
    this.#node = node;
    this.#index = index;

    // make HTML
    this.#ROOT = document.createElement('tr');
    this.#ROOT.classList.add('item');
    if (!tip) this.#ROOT.classList.add('-haschild');
    this.#ROOT.dataset.id = node;
    this.#ROOT.dataset.count = count;
    this.#ROOT.innerHTML = `
    <td class="label">
      <label class="key">
        <input type="checkbox" value="${node}"${!tip ? '' : ' disabled'}/>
        ${label}
      </label>
      <label class="value">
        <input type="checkbox" value="${node}"/>
        ${label}
      </label>
    </td>
    <td class="total">${count.toLocaleString()}</td>
    <td class="mapped"></td>
    <td class="pvalue"></td>
    <td class="drilldown"></td>`;

    this.#INPUT_VALUE = this.#ROOT.querySelector(':scope > td.label > label.value > input');
    this.#INPUT_KEY = this.#ROOT.querySelector(':scope > td.label > label.key > input');
    if (selectedCategoryIds.keys.indexOf(node) !== -1) this.#INPUT_KEY.checked = true;
    if (selectedCategoryIds.values.indexOf(node) !== -1) this.#INPUT_VALUE.checked = true;

    // even listener
    this.#INPUT_KEY.addEventListener('change', e => {
      if (e.target.checked) {
        ConditionBuilder.addAttribute(column.attributeId, node);
      } else {
        ConditionBuilder.removeAttribute(column.attributeId, node);
      }
    });
    DefaultEventEmitter.addEventListener(event.mutateAttributeCondition, ({detail: {action, keyCondition}}) => {
      if (action === 'remove') {
        if (column.attributeId === keyCondition.attributeId) {
          if (keyCondition.parentNode && node === keyCondition.parentNode) {
            this.#INPUT_KEY.checked = action === 'add';
          }
        }
      }
    });
    DefaultEventEmitter.addEventListener(event.mutateAttributeValueCondition, ({detail}) => {
      if (column.attributeId === detail.attributeId && node === detail.node) {
        this.#INPUT_VALUE.checked = detail.action === 'add';
      }
    });
    DefaultEventEmitter.addEventListener(event.setUserValues, ({detail: {attributeId, values}}) => {
      if (column.attributeId === attributeId) this.setUserValues(values);
    });
    DefaultEventEmitter.addEventListener(event.clearUserValues, this.#clearUserValues.bind(this));

    // select/deselect a item (attribute) > label
    this.#INPUT_VALUE.addEventListener('click', column.checkValue.bind(column));

    // drill down
    if (!tip) {
      const drilldown = this.#ROOT.querySelector(':scope > .drilldown');
      drilldown.addEventListener('click', column.drillDown.bind(column));
    }

  }


  // private methods

  #clearUserValues() {
    this.#ROOT.classList.remove('-pinsticking');
  }


  // public methods

  update(color, isLog10, max) {
    const count = isLog10 ? Math.log10(this.#count) : this.#count;
    this.#ROOT.style.backgroundColor = `rgb(${color.mix(App.colorWhite, 1 - count / max).coords.map(cood => cood * 256).join(',')})`;
  }

  setUserValues(values) {
    const value = values.find(value => value.node === this.#node);
    if (value) {
      this.#ROOT.classList.add('-pinsticking');
      this.#ROOT.querySelector(':scope > .mapped').textContent = value.hit_count ? value.hit_count.toLocaleString() : '';
      this.#ROOT.querySelector(':scope > .pvalue').textContent = value.pValue ? value.pValue.toExponential(2) : '';
      if (value.hit_count === 0) this.#ROOT.classList.remove('-pinsticking');
      else this.#ROOT.classList.add('-pinsticking');

    }
  }


  // accessors

  get label() {
    return this.#label;
  }

  get count() {
    return this.#count;
  }

  get index() {
    return this.#index;
  }

  get node() {
    return this.#node;
  }

  get rootNode() {
    return this.#ROOT;
  }

}
