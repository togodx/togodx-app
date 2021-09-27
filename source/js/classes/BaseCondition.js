import Records from "./Records";

export default class BaseCondition {

  _propertyId;
  #key;
  #subjectId;
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

  get subjectId() {
    if (!this.#subjectId) {
      this.#subjectId = this.key.subjectId;
    }
    return this.#subjectId;
  }

  get dataset() {
    if (!this.#dataset) {
      this.#dataset = this.key.primaryKey;
    }
    return this.#dataset;
  }

}