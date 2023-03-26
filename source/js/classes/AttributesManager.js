import {displayedAttributes} from '../functions/localStorage.js';

class AttributesManager {
  #displayedAttributes;
  #sets;

  constructor() {}

  async init(api) {
    // Determine display attribute information. If data is available in local storage, use it; if not, query the API.
    const storagedData = JSON.parse(
      window.localStorage.getItem(displayedAttributes)
    );
    if (storagedData) {
      this.#displayedAttributes = storagedData;
    } else {
      this.#displayedAttributes = api
        ? await fetch(api)
            .then(res => res.json())
            .then(json => {
              this.#sets = json.sets;
              return this.#sets.find(set => (set.label = 'Default'))?.set;
            })
            .catch(() => undefined)
        : undefined;
    }
  }

  // Returns whether the attribute is included in the display attribute list.
  containsInDisplayedAttributes(id) {
    return this.#displayedAttributes.indexOf(id) >= 0;
  }

  update(map) {
    map.forEach((isDisplay, id) => {
      const index = this.#displayedAttributes.indexOf(id);
      if (index === -1) {
        if (isDisplay) this.#displayedAttributes.push(id);
      } else {
        if (!isDisplay) this.#displayedAttributes.splice(index, 1);
      }
    });
    console.log(this.#displayedAttributes);
    window.localStorage.setItem(
      displayedAttributes,
      JSON.stringify(this.#displayedAttributes)
    );
  }

  get sets() {
    return this.#sets;
  }
}

export default new AttributesManager();
