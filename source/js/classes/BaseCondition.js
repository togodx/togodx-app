import Records from "./Records";

export default class BaseCondition {

  _propertyId;
  #key;
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
    if (!this.#key) {
      this.#key = Records.getProperty(this._propertyId);
    }
    return this.#key;
  }

  get catexxxgoryId() {
    if (!this.#catexxxgoryId) {
      this.#catexxxgoryId = this.key.catexxxgoryId;
    }
    return this.#catexxxgoryId;
  }

  get dataset() {
    if (!this.#dataset) {
      this.#dataset = this.key.primaryKey;
    }
    return this.#dataset;
  }

}