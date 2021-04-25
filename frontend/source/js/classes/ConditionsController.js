import TableData from "./TableData";
import DefaultEventEmitter from "./DefaultEventEmitter";
import {EVENT_completeQueryParameter, EVENT_selectTableData} from '../events';

export default class ConditionsController {

  #tableData;
  #body;
  #conditionsContainer;

  constructor(elm) {

    this.#tableData = [];

    // references
    this.#conditionsContainer = elm.querySelector(':scope > .conditions');
    this.#body = document.querySelector('body');

    // event listener
    DefaultEventEmitter.addEventListener(EVENT_completeQueryParameter, e => this.#setTableData(e.detail));
    DefaultEventEmitter.addEventListener(EVENT_selectTableData, e => this.#selectTableData(e.detail));
  }

  /* private methods */

  #setTableData(newCondition) {

    // find matching condition from already existing conditions
    // TODO: うまく検出できていない
    const sameConditionTableData = this.#tableData.find(tableData => {
      const matchTogoKey = newCondition.togoKey === tableData.condition.togoKey;
      // compare properties
      const matchProperties = newCondition.properties.every(newProperty => {
        return tableData.condition.properties.find(property => newProperty.query.propertyId === property.query.propertyId)
      });
      // compare attributes
      const matchAttributes = newCondition.attributes.every(newProperty => {
        return tableData.condition.attributes.find(property => {
          const matchId = newProperty.query.propertyId === property.query.propertyId;
          let matchValues = newProperty.query.categoryIds.every(categoryId => property.query.categoryIds.indexOf(categoryId) !== -1);
          return matchId && matchValues;
        });
      });
      return matchTogoKey && matchProperties && matchAttributes;
    });

    if (sameConditionTableData) {
      // use existing table data
      sameConditionTableData.select();
    } else {
      // make new table data
      const elm = document.createElement('div');
      this.#conditionsContainer.insertAdjacentElement('afterbegin', elm);
      this.#tableData.push(new TableData(newCondition, elm));
    }
  }

  #selectTableData(selectedTableData) {
    this.#body.dataset.display = 'results';
    // deselect
    for (const tableData of this.#tableData) {
      if (tableData !== selectedTableData) tableData.deselect();
    }
  }

}
