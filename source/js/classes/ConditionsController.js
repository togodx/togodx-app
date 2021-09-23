import TableData from "./TableData";
import DefaultEventEmitter from "./DefaultEventEmitter";
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
    DefaultEventEmitter.addEventListener(event.completeQueryParameter, e => this.#setTableData(e.detail));
    DefaultEventEmitter.addEventListener(event.selectTableData, e => this.#selectTableData(e.detail));
    DefaultEventEmitter.addEventListener(event.deleteTableData, e => this.#deleteTableData(e.detail));

    // observe number of conditions
    const config = { attributes: false, childList: true, subtree: false };
    const callback = (mutationsList, observer) => {
      this.#ROOT.dataset.numberOfConditions = this.#CONDITIONS_CONTAINER.childNodes.length;
    };
    const observer = new MutationObserver(callback);
    observer.observe(this.#CONDITIONS_CONTAINER, config);
  }

  /* private methods */

  #setTableData(newCondition) {
    console.log(newCondition)

    // find matching condition from already existing conditions
    const sameConditionTableData = this.#tableData.find(tableData => {
      console.log(tableData.condition)
      // TODO: table Data に渡すデータも最適化したいが、現在なかなか合流されない他のブランチで編集中のため、見送り
      if (newCondition.togoKey !== tableData.condition.togoKey) return;
      // compare properties
      const matchProperties = (() => {
        if (newCondition.properties.length === tableData.condition.properties.length) {
          return newCondition.properties.every(newProperty => {
            const matchProperty = tableData.condition.properties.find(property => {
              if (newProperty.query.propertyId === property.query.propertyId) {
                return newProperty.parentCategoryId === property.parentCategoryId;
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
      const matchAttributes = (() => {
        if (newCondition.attributes.length === tableData.condition.attributes.length) {
          return newCondition.attributes.every(newProperty => {
            tableData.condition.attributes.find(property => {
              if (
                newProperty.query.propertyId === property.query.propertyId &&
                newProperty.query.categoryIds.length === property.query.categoryIds.length
              ) {
                let matchValues = newProperty.query.categoryIds.every(categoryId => {
                  return property.query.categoryIds.indexOf(categoryId) !== -1;
                });
                return matchValues;
              } else {
                return false;
              }
            });
          });
        } else {
          return false;
        }
      })();
      return matchProperties && matchAttributes;
    });
    console.log(sameConditionTableData)

    if (sameConditionTableData) {
      // use existing table data
      sameConditionTableData.select();
    } else {
      // make new table data
      const elm = document.createElement('div');
      this.#CONDITIONS_CONTAINER.insertAdjacentElement('afterbegin', elm);
      const newNew__condition = {
        togoKey: newCondition.togoKey,
        properties: newCondition.properties.map(property => {
          return {
            propertyId: property.query.propertyId,
            parentCategoryId: property.parentCategoryId
          }
        }),
        attributes: newCondition.attributes.map(property => {
          return {
            propertyId: property.query.propertyId,
            categoryIds: property.query.categoryIds
          }
        })
      }
      console.log(newNew__condition)
      this.#tableData.push(new TableData(newCondition, newNew__condition, elm));
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
