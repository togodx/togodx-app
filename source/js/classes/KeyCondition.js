import Records from "./Records";

export default class KeyCondition {

  #propertyId;
  #parentCategoryId;

  constructor(propertyId, parentCategoryId) {
    this.#propertyId = propertyId;
    this.#parentCategoryId = parentCategoryId;
  }

  /**
   * 
   * @param {String} propertyId 
   * @param {String} parentCategoryId 
   * @return {Boolean}
   */
  isSameCondition(propertyId, parentCategoryId) {
    if (propertyId === this.#propertyId) {
      if (parentCategoryId) {
        return parentCategoryId === this.#parentCategoryId;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  get propertyId() {
    return this.#propertyId;
  }

  get parentCategoryId() {
    return this.#parentCategoryId;
  }

}
