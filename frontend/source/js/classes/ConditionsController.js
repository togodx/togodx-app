import TableData from "./TableData";
import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

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
    DefaultEventEmitter.addEventListener(event.completeQueryParameter, e => this.#setTableData(e.detail));
    DefaultEventEmitter.addEventListener(event.selectTableData, e => this.#selectTableData(e.detail));
    DefaultEventEmitter.addEventListener(event.deleteTableData, e => this.#deleteTableData(e.detail));
  }

  /* private methods */

  #setTableData(newCondition) {

    // find matching condition from already existing conditions
    const sameConditionTableData = this.#tableData.find(tableData => {
      const matchTogoKey = newCondition.togoKey === tableData.condition.togoKey;
      // compare properties
      const matchProperties = (() => {
        if (newCondition.properties.length === tableData.condition.properties.length) {
          return newCondition.properties.every(newProperty => {
            const matchProperty = tableData.condition.properties.find(property => {
              if (newProperty.query.propertyId === property.query.propertyId) {
                return (newProperty.subCategory === undefined && property.subCategory === undefined) || (newProperty.subCategory?.parentCategoryId === property.subCategory?.parentCategoryId);
              } else {
                return false;
              }
            });
            return matchProperty;
          });
        } else {
          return false;
        }
      })();
      // compare attributes
      const matchAttributes = newCondition.attributes.every(newProperty => {
        return tableData.condition.attributes.find(property => {
          if (
            newProperty.query.propertyId === property.query.propertyId &&
            newProperty.query.categoryIds.length === property.query.categoryIds.length) {
            let matchValues = newProperty.query.categoryIds.every(categoryId => property.query.categoryIds.indexOf(categoryId) !== -1);
            console.log(matchValues, newProperty.query.categoryIds, property.query.categoryIds)
            return matchValues;
          } else {
            return false;
          }
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

  #deleteTableData(tableData) {
    const index = this.#tableData.indexOf(tableData);
    this.#tableData.splice(index, 1);
  }

}
