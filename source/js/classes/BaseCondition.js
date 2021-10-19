import Records from "./Records";

export default class BaseCondition {

  _attributeId;
  #key; // <Attribute>
  #catexxxgoryId;
  #dataset;

  constructor(attributeId) {
    this._attributeId = attributeId;
  }


  // accessor

  get attributeId() {
    return this._attributeId;
  }

  get key() {
    if (!this.#key) this.#key = Records.getAttribute(this._attributeId);
    return this.#key;
  }

  get catexxxgoryId() {
    if (!this.#catexxxgoryId) {
      this.#catexxxgoryId = Records.getCatexxxgoryWithAttributeId(this.key.id).id;
    }
    return this.#catexxxgoryId;
  }

  get dataset() {
    if (!this.#dataset) {
      this.#dataset = this.key.dataset;
    }
    return this.#dataset;
  }

}