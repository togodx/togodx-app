import KeyCondition from "./KeyCondition";
import ValuesCondition from "./ValuesCondition";

export default class DXCondition {

  #togoKey;
  #keyConditions;
  #valuesConditions;

  constructor(togoKey, keyConditions, valuesConditions) {
    this.#togoKey = togoKey;
    this.#keyConditions = this.#copyKeyConditions(keyConditions);
    this.#valuesConditions = this.#copyValuesConditions(valuesConditions);
  }


  // methods

  /**
   * 
   * @param {DXCondition} dxCondition 
   * @return Boolean
   */
  checkSameCondition(dxCondition) {
    // keys
    let matchKeys = false;
    if (this.keyConditions.length === dxCondition.keyConditions.length) {
      matchKeys = this.keyConditions.every(keyCondition => {
        return dxCondition.keyConditions.findIndex(newKeyCondition => {
          return (
            keyCondition.attributeId === newKeyCondition.attributeId &&
            keyCondition.parentCategoryId === newKeyCondition.parentCategoryId
          );
        }) !== -1;
      });
    }
    // values
    let matchValues = false;
    if (this.valuesConditions.length === dxCondition.valuesConditions.length) {
      matchValues = this.valuesConditions.every(valuesCondition => {
        return dxCondition.valuesConditions.findIndex(newValuesCondition => {
          return (
            valuesCondition.attributeId === newValuesCondition.attributeId &&
            (
              valuesCondition.categoryIds.length === newValuesCondition.categoryIds.length &&
              valuesCondition.categoryIds.every(categoryId => {
                return newValuesCondition.categoryIds.findIndex(newCategoryId => categoryId === newCategoryId) !== -1;
              })
            )
          );
        }) !== -1;
      });
    }
    return dxCondition.togoKey === this.togoKey && matchKeys && matchValues;
  }

  #copyKeyConditions(keyConditions) {
    return keyConditions.map(keyCondition => new KeyCondition(keyCondition.attributeId, keyCondition.parentCategoryId));
  }

  #copyValuesConditions(valuesConditions) {
    return valuesConditions.map(valuesCondition => new ValuesCondition(valuesCondition.attributeId, [...valuesCondition.categoryIds]));
  }


  // accessor

  get togoKey() {
    return this.#togoKey;
  }

  get keyConditions() {
    return this.#keyConditions;
  }

  get valuesConditions() {
    return this.#valuesConditions;
  }

  get queryFilters() {
    return this.#valuesConditions.map(valuesConditions => valuesConditions.query);
  }

  get queryAnnotations() {
    return this.#keyConditions.map(keyConditions => keyConditions.query);
  }

}