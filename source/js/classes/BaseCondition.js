import Records from "./Records";

export default class BaseCondition {

  _propertyId;
  #key;

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

}