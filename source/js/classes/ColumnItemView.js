import DefaultEventEmitter from './DefaultEventEmitter.ts';
import ConditionBuilder from './ConditionBuilder.ts';
import ConditionAnnotationUtility from './ConditionAnnotationUtility.ts';
import App from './App.ts';
import * as event from '../events';

export default class ColumnItemView {
  #label;
  #count;
  #mapped;
  #pvalue;
  #node;
  #index;
  #ROOT;
  #INPUT_VALUE;
  #INPUT_KEY;

  constructor(column, {count, node, tip, label}, index, selectedNodes) {
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
      <label class="annotation">
        <input type="checkbox" value="${node}"${!tip ? '' : ' disabled'}/>
        ${label}
      </label>
      <label class="filter">
        <input type="checkbox" value="${node}"/>
        ${label}
      </label>
    </td>
    <td class="total">${count.toLocaleString()}</td>
    <td class="mapped"></td>
    <td class="pvalue"></td>
    <td class="drilldown"></td>`;

    this.#INPUT_VALUE = this.#ROOT.querySelector(
      ':scope > td.label > label.filter > input'
    );
    this.#INPUT_KEY = this.#ROOT.querySelector(
      ':scope > td.label > label.annotation > input'
    );
    if (selectedNodes.annotations.indexOf(node) !== -1)
      this.#INPUT_KEY.checked = true;
    if (selectedNodes.filters.indexOf(node) !== -1)
      this.#INPUT_VALUE.checked = true;

    // even listener
    this.#INPUT_KEY.addEventListener('change', e => {
      const conditionUtilityAnnotation = new ConditionAnnotationUtility(
        column.attributeId,
        node
      );
      if (e.target.checked) {
        ConditionBuilder.addAnnotation(conditionUtilityAnnotation);
      } else {
        ConditionBuilder.removeAnnotation(column.attributeId, node);
      }
    });
    DefaultEventEmitter.addEventListener(
      event.mutateAnnotationCondition,
      ({detail: {action, conditionUtilityAnnotation}}) => {
        if (action === 'remove') {
          if (column.attributeId === conditionUtilityAnnotation.attributeId) {
            if (
              conditionUtilityAnnotation.nodeId &&
              node === conditionUtilityAnnotation.nodeId
            ) {
              this.#INPUT_KEY.checked = action === 'add';
            }
          }
        }
      }
    );
    DefaultEventEmitter.addEventListener(
      event.mutateFilterCondition,
      ({detail}) => {
        if (column.attributeId === detail.attributeId && node === detail.node) {
          this.#INPUT_VALUE.checked = detail.action === 'add';
        }
      }
    );
    DefaultEventEmitter.addEventListener(
      event.setUserFilters,
      ({detail: {attributeId, filters}}) => {
        if (column.attributeId === attributeId) this.setUserFilters(filters);
      }
    );
    DefaultEventEmitter.addEventListener(
      event.clearUserFilters,
      this.#clearUserFilters.bind(this)
    );

    // select/deselect a item (attribute) > label
    this.#INPUT_VALUE.addEventListener(
      'click',
      column.checkFilter.bind(column)
    );

    // drill down
    if (!tip) {
      const drilldown = this.#ROOT.querySelector(':scope > .drilldown');
      drilldown.addEventListener('click', column.drillDown.bind(column));
    }
  }

  // private methods

  #clearUserFilters() {
    this.#ROOT.classList.remove('-pinsticking');
  }

  // public methods

  update(color, isLog10, max) {
    const count = isLog10 ? Math.log10(this.#count) : this.#count;
    this.#ROOT.style.backgroundColor = `rgb(${color
      .mix(App.colorWhite, 1 - count / max)
      .coords.map(cood => cood * 256)
      .join(',')})`;
  }

  setUserFilters(filters) {
    const filter = filters.find(filter => filter.node === this.#node);
    if (filter) {
      this.#mapped = filter.mapped ?? null;
      this.#pvalue = filter.pvalue ?? null;
      this.#ROOT.classList.add('-pinsticking');
      this.#ROOT.querySelector(':scope > .mapped').textContent = filter.mapped
        ? filter.mapped.toLocaleString()
        : '';
      this.#ROOT.querySelector(':scope > .pvalue').textContent = filter.pvalue
        ? filter.pvalue.toExponential(2)
        : '';
      if (filter.mapped === 0) this.#ROOT.classList.remove('-pinsticking');
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

  get mapped() {
    return this.#mapped;
  }

  get pvalue() {
    return this.#pvalue;
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
