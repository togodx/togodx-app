import Records from "./Records";

export default class KeyCondition {

  #propertyId;
  #parentCategoryId;
  #key;
  #value;

  constructor(propertyId, parentCategoryId) {
    this.#propertyId = propertyId;
    this.#parentCategoryId = parentCategoryId;
  }
  

  // methods
  
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


  // accessor

  get propertyId() {
    return this.#propertyId;
  }

  get parentCategoryId() {
    return this.#parentCategoryId;
  }

  get label() {
    console.log( Records.getValue(this.#propertyId, this.#parentCategoryId) )
    if (this.#parentCategoryId) {
      return this.value.label;
    } else {
      return this.key.label;
    }
  }

  get key() {
    if (!this.#key) {
      this.#key = Records.getProperty(this.#propertyId);
    }
    return this.#key;
  }

  get value() {
    if (!this.#value) {
      this.#value = Records.getValue(this.#propertyId, this.#parentCategoryId);
    }
    return this.#value;
  }

  get query() {
    const query = {
      propertyId: this.#propertyId
    };
    if (this.#parentCategoryId) query.categoryIds = [this.#parentCategoryId];
    return query;
  }

}
