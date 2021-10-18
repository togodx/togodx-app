import Records from "./Records";

export default class BaseCondition {

  _propertyId;
  #key; // <Attribute>
  #catexxxgoryId;
  #dataset;

  constructor(propertyId) {
    this._propertyId = propertyId;
  }


  // accessor

  get propertyId() {
    return this._propertyId;
  }

  get key() {
    if (!this.#key) this.#key = Records.getAttribute(this._propertyId);
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