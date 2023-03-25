import {displayedAttributes} from '../functions/localStorage.js';

class AttributesManager {
  #displayedAttributes;

  constructor() {}

  async init(api) {
    // Determine display attribute information. If data is available in local storage, use it; if not, query the API.
    const storagedData = window.localStorage.getItem(displayedAttributes);
    this.#displayedAttributes =
      JSON.parse(storagedData) || api
        ? await fetch(api)
            .then(res => res.json())
            .then(json => json)
            .catch(() => undefined)
        : undefined;
  }

  // Returns whether the attribute is included in the display attribute list.
  containsInDisplayedAttributes(id) {
    return this.#displayedAttributes.indexOf(id) >= 0;
  }
}

export default new AttributesManager();
