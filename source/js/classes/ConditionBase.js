import Records from "./Records";

export default class ConditionBase {

  _attributeId;
  #annotation; // <Attribute>
  #catexxxgoryId;
  #dataset;

  constructor(attributeId) {
    this._attributeId = attributeId;
  }


  // accessor

  get attributeId() {
    return this._attributeId;
  }
  get node() {
    return this._attributeId;
  }

  get annotation() {
    if (!this.#annotation) this.#annotation = Records.getAttribute(this._attributeId);
    return this.#annotation;
  }

  get catexxxgoryId() {
    if (!this.#catexxxgoryId) {
      this.#catexxxgoryId = Records.getCatexxxgoryWithAttributeId(this.annotation.id).id;
    }
    return this.#catexxxgoryId;
  }

  get dataset() {
    if (!this.#dataset) {
      this.#dataset = this.annotation.dataset;
    }
    return this.#dataset;
  }

}