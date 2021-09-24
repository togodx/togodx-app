import BaseCondition from "./BaseCondition";
import Records from "./Records";

export default class ValuesCondition extends BaseCondition {

  #categoryIds;

  constructor(propertyId, categoryIds) {
    super(propertyId);
    this.#categoryIds = categoryIds;
  }


  // methods

  addCategoryId(categoryId) {
    this.categoryIds.push(categoryId);
  }

  removeCategoryId(categoryId) {
    const index = this.#categoryIds.indexOf(categoryId);
    this.#categoryIds.splice(index, 1);
  }


  // accessor

  get categoryIds() {
    return this.#categoryIds;
  }

}
