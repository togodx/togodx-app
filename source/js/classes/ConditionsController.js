import TableData from './TableData';
import DefaultEventEmitter from './DefaultEventEmitter';
import * as event from '../events';

export default class ConditionsController {
  #tableData;
  #ROOT;
  #CONDITIONS_CONTAINER;

  constructor(elm) {
    this.#tableData = [];

    // references
    this.#ROOT = elm;
    this.#CONDITIONS_CONTAINER = elm.querySelector(':scope > .conditions');

    // event listener
    DefaultEventEmitter.addEventListener(event.completeQueryParameter, e =>
      this.#setTableData(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.selectTableData, e =>
      this.#selectTableData(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.deleteTableData, e =>
      this.#deleteTableData(e.detail)
    );

    // observe number of conditions
    const config = {attributes: false, childList: true, subtree: false};
    const callback = (mutationsList, observer) => {
      this.#ROOT.dataset.numberOfConditions =
        this.#CONDITIONS_CONTAINER.childNodes.length;
    };
    const observer = new MutationObserver(callback);
    observer.observe(this.#CONDITIONS_CONTAINER, config);
  }

  /* private methods */

  /**
   *
   * @param {DXCondition} dxCondition
   */
  #setTableData(dxCondition) {
    // find matching condition from already existing conditions
    const sameConditionTableData = this.#tableData.find(tableData =>
      tableData.dxCondition.checkSameCondition(dxCondition)
    );
    if (sameConditionTableData) {
      // use existing table data
      sameConditionTableData.select();
    } else {
      // make new table data
      const elm = document.createElement('div');
      this.#CONDITIONS_CONTAINER.insertAdjacentElement('afterbegin', elm);
      this.#tableData.push(new TableData(dxCondition, elm));
    }
  }

  #selectTableData(selectedTableData) {
    document.body.dataset.display = 'results';
    // deselect
    for (const tableData of this.#tableData) {
      if (tableData !== selectedTableData) tableData.deselect();
    }
  }

  #deleteTableData(tableData) {
    const index = this.#tableData.indexOf(tableData);
    this.#tableData.splice(index, 1);
  }
}
