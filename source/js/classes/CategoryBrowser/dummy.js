export class Dummy {
  #elm;
  #attribute;
  #items;

  constructor(elm, attribute, items) {
    this.#elm = elm;
    this.#attribute = attribute;
    this.#items = items;
    console.log({elm, attribute, items});
  }

  get #api() {
    return this.#elm.dataset.api + '?hierarchy';
  }
}
