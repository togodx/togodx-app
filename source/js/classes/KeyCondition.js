import BaseCondition from "./BaseCondition";
import Records from "./Records";

export default class KeyCondition extends BaseCondition {

  #parentCategoryId;
  #value;
  #ancestors;

  constructor(attributeId, parentCategoryId) {
    super(attributeId);
    this.#parentCategoryId = parentCategoryId;
  }


  // methods
  
  /**
   * 
   * @param {String} attributeId 
   * @param {String} parentCategoryId 
   * @return {Boolean}
   */
  isSameCondition(attributeId, parentCategoryId) {
    if (attributeId === this._attributeId) {
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
      propertyId: this._attributeId
    };
    if (this.#parentCategoryId) {
      key.id = {
        categoryId: this.#parentCategoryId,
        ancestors: this.ancestors
      }
    }
    return key;
  }


  // accessor

  get parentCategoryId() {
    return this.#parentCategoryId;
  }

  get ancestors() {
    if (!this.#ancestors) {
      this.#ancestors = Records.getAncestors(this._attributeId, this.#parentCategoryId).map(ancestor => ancestor.categoryId);
    }
    return this.#ancestors;
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
      this.#value = Records.getValue(this._attributeId, this.#parentCategoryId);
    }
    return this.#value;
  }

  get query() {
    const query = {
      attribute: this._attributeId
    };
    if (this.#parentCategoryId) query.node = this.#parentCategoryId;
    return query;
  }

}
