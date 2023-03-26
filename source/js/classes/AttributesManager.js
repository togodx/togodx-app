import DefaultEventEmitter from './DefaultEventEmitter';
import {displayedAttributes} from '../functions/localStorage.js';
import * as event from '../events';

class AttributesManager {
  #displayedAttributes;
  #sets;

  constructor() {}

  async init(api) {
    // Determine display attribute information. If data is available in local storage, use it; if not, query the API.

    await fetch(api)
      .then(res => res.json())
      .then(json => {
        this.#sets = json.sets;
        this.#displayedAttributes = this.#sets.find(
          set => (set.label = 'Default')
        )?.set;
      })
      .catch(() => {
        this.#sets = [];
        this.#displayedAttributes = undefined;
      });

    const storagedData = JSON.parse(
      window.localStorage.getItem(displayedAttributes)
    );
    if (storagedData) {
      this.#displayedAttributes = storagedData;
    }

    // const storagedData = JSON.parse(
    //   window.localStorage.getItem(displayedAttributes)
    // );
    // if (storagedData) {
    //   this.#displayedAttributes = storagedData;
    // } else {
    //   this.#displayedAttributes = api
    //     ? await fetch(api)
    //         .then(res => res.json())
    //         .then(json => {
    //           this.#sets = json.sets;
    //           return this.#sets.find(set => (set.label = 'Default'))?.set;
    //         })
    //         .catch(() => undefined)
    //     : undefined;
    // }
  }

  // Returns whether the attribute is included in the display attribute list.
  containsInDisplayedAttributes(id) {
    return this.#displayedAttributes.indexOf(id) >= 0;
  }

  /**
   *
   * @param {Map} differenceData
   */
  updateByDifferenceData(differenceData) {
    differenceData.forEach((isDisplay, id) => {
      const index = this.#displayedAttributes.indexOf(id);
      if (index === -1) {
        if (isDisplay) this.#displayedAttributes.push(id);
      } else {
        if (!isDisplay) this.#displayedAttributes.splice(index, 1);
      }
    });
    window.localStorage.setItem(
      displayedAttributes,
      JSON.stringify(this.#displayedAttributes)
    );
  }

  updateBySetLabel(label) {
    const set = this.#sets.find(set => set.label === label)?.set;
    if (set) {
      this.#displayedAttributes = [...set];
      window.localStorage.setItem(
        displayedAttributes,
        JSON.stringify(this.#displayedAttributes)
      );
      const customEvent = new CustomEvent(event.changeDisplayedAttributeSet, {
        detail: [...set],
      });
      DefaultEventEmitter.dispatchEvent(customEvent);
    }
  }

  downloadCurrentSet() {
    const str = JSON.stringify(this.#displayedAttributes, null, ' ');
    const blob = new Blob([str], {type: 'application/json'});
    const dummyAnchor = document.createElement('a');
    document.body.append(dummyAnchor);
    dummyAnchor.href = window.URL.createObjectURL(blob);
    dummyAnchor.download = 'attributes_set.json';
    dummyAnchor.click();
    dummyAnchor.remove();
  }

  get sets() {
    return this.#sets;
  }
}

export default new AttributesManager();
