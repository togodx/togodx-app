export default class Attribute {

  #id;
  #obj;

  constructor(id, obj) {
    this.#id = id;
    this.#obj = obj;
  }

  get id() {
    return this.#id;
  }

  get label() {
    return this.#obj.label;
  }

  get description() {
    return this.#obj.description;
  }

  get api() {
    return this.#obj.api;
  }

  get dataset() {
    return this.#obj.dataset;
  }

  get datamodel() {
    return this.#obj.datamodel;
  }

  get source() {
    return this.#obj.source;
  }

}