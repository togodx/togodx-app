import Records from "./Records";

export default class ValuesCondition {

  #propertyId
  #categoryIds

  constructor(propertyId, categoryIds) {
    this.#propertyId = propertyId;
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

  get propertyId() {
    return this.#propertyId;
  }

  get categoryIds() {
    return this.#categoryIds;
  }

}
