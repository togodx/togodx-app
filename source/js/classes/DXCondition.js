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

  #copyKeyConditions(keyConditions) {
    return keyConditions.map(keyCondition => new KeyCondition(keyCondition.propertyId, keyCondition.parentCategoryId));
  }

  #copyValuesConditions(valuesConditions) {
    return valuesConditions.map(valuesCondition => new ValuesCondition(valuesCondition.propertyId, valuesCondition.categoryIds));
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

  get queryIds() {
    return encodeURIComponent(
      JSON.stringify(
        this.#valuesConditions
          .map(
            valuesConditions => valuesConditions.query
          )
      )
    );
  }

  get queryProperties() {
    return encodeURIComponent(
      JSON.stringify(
        [
          ...this.#valuesConditions.map(valuesConditions => valuesConditions.query),
          ...this.#keyConditions.map(keyConditions => keyConditions.query)
        ]
      )
    );
  }

}