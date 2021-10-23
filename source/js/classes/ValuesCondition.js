import BaseCondition from "./BaseCondition";
import Records from "./Records";

export default class ValuesCondition extends BaseCondition {

  #categoryIds;

  constructor(attributeId, categoryIds) {
    super(attributeId);
    this.#categoryIds = categoryIds;
  }


  // methods

  addCategoryId(categoryId) {
    this.#categoryIds.push(categoryId);
  }

  removeCategoryId(categoryId) {
    const index = this.#categoryIds.indexOf(categoryId);
    this.#categoryIds.splice(index, 1);
  }

  getURLParameter() {
    const values = {
      propertyId: this._attributeId, // TODO:
      ids: []
    }
    this.#categoryIds.forEach(categoryId => {
      const id = {categoryId};
      const ancestors = Records.getAncestors(this._attributeId, categoryId).map(ancestor => ancestor.categoryId);
      if (ancestors.length > 0) id.ancestors = ancestors;
      values.ids.push(id);
    })
    return values;
}


  // accessor

  get categoryIds() {
    return this.#categoryIds;
  }

  get label() {
    return this.key.label;
  }

  get query() {
    return {
      attribute: this._attributeId,
      nodes: this.categoryIds
    }
  }

}
