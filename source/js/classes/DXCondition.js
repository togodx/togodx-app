import KeyCondition from "./KeyCondition";
import ValuesCondition from "./ValuesCondition";

export default class DXCondition {

  #togoKey;
  #keyConditions;
  #valuesConditions;

  constructor(togoKey, keyConditions, valuesConditions) {
    this.#togoKey = togoKey;
    this.#keyConditions = keyConditions.map(keyCondition => new KeyCondition(keyCondition.propertyId, keyCondition.parentCategoryId));
    this.#valuesConditions = valuesConditions.map(valuesCondition => new ValuesCondition(valuesCondition.propertyId, valuesCondition.categoryIds));
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

}