class AttributesManager {
  #standardDisplayedAttributes;

  constructor() {}

  async init(api) {
    this.#standardDisplayedAttributes = api
      ? await fetch(api)
          .then(res => res.json())
          .then(json => json)
          .catch(() => undefined)
      : undefined;
    console.log(this.#standardDisplayedAttributes);
  }
}

export default new AttributesManager();
