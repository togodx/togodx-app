import BaseCondition from "./BaseCondition";
import Records from "./Records";

export default class KeyCondition extends BaseCondition {

  #parentCategoryId;
  #value;

  constructor(propertyId, parentCategoryId) {
    super(propertyId);
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
    if (propertyId === this._propertyId) {
      if (parentCategoryId) {
        return parentCategoryId === this.#parentCategoryId;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  getURLParameter() {
    const key = {
      propertyId: this.propertyId
    };
    if (this.#parentCategoryId) {
      key.id = {
        categoryId: this.#parentCategoryId,
        ancestors: Records.getAncestors(this.propertyId, this.#parentCategoryId).map(ancestor => ancestor.categoryId)
      }
    }
    return key;
  }


  // accessor


  get parentCategoryId() {
    return this.#parentCategoryId;
  }

  get label() {
    if (this.#parentCategoryId) {
      return this.value.label;
    } else {
      return this.key.label;
    }
  }


  get value() {
    if (!this.#value) {
      this.#value = Records.getValue(this._propertyId, this.#parentCategoryId);
    }
    return this.#value;
  }

  get query() {
    const query = {
      propertyId: this._propertyId
    };
    if (this.#parentCategoryId) query.categoryIds = [this.#parentCategoryId];
    return query;
  }

}
