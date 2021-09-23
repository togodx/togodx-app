export default class DXCondition {

  #togoKey;
  #keyConditions;

  constructor(togoKey, keyConditions) {
    this.#togoKey = togoKey;
    this.#keyConditions = keyConditions;
  }

  get togoKey() {
    return this.#togoKey;
  }

  get keyConditions() {
    return this.#keyConditions;
  }

}