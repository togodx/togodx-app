import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import {displayedAttributes} from '../functions/localStorage.js';
import * as event from '../events';
import {Preset, AttributeSet} from '../interfaces';

class AttributesManager {
  #displayedAttributes: string[];
  #sets: AttributeSet[];

  constructor() {}

  // public

  async init(api: string): Promise<void> {
    // Determine display attribute information. If data is available in local storage, use it; if not, query the API.

    await fetch(api)
      .then(res => res.json())
      .then((preset: Preset) => {
        this.#sets = preset.attribute_sets;
        this.#displayedAttributes = this.#sets.find(
          set => set.label === 'Default'
        )!.set;
      })
      .catch(() => {
        this.#sets = [];
        this.#displayedAttributes = [];
      });

    const json: string =
      window.localStorage.getItem(displayedAttributes) || '[]';
    const storagedData: string[] = JSON.parse(json);
    if (storagedData.length > 0) {
      this.#displayedAttributes = storagedData;
    }
  }

  // Returns whether the attribute is included in the display attribute list.
  containsInDisplayedAttributes(id: string): boolean {
    return this.#displayedAttributes.indexOf(id) >= 0;
  }

  /**
   *
   * @param {Map} differenceData
   */
  updateByDifferenceData(differenceData: Map<string, boolean>): void {
    console.log(differenceData);
    differenceData.forEach((isDisplay, id) => {
      const index = this.#displayedAttributes.indexOf(id);
      if (index === -1) {
        if (isDisplay) this.#displayedAttributes.push(id);
      } else {
        if (!isDisplay) this.#displayedAttributes.splice(index, 1);
      }
    });
    this.#changed(false);
  }

  updateBySetLabel(label) {
    console.log(label);
    const set = this.#sets.find(set => set.label === label)?.set;
    if (set) {
      this.#displayedAttributes = [...set];
      this.#changed();
    }
  }

  importSet(file) {
    console.log(file);
    const reader = new FileReader();
    reader.onerror = e => {
      console.error(e);
      window.alert('Failed to load.');
    };
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target.result);
        const existingIds = Records.attributes.map(attribute => attribute.id);
        const filteredSet = json.filter(id => existingIds.indexOf(id) >= 0);
        // update
        this.#displayedAttributes = filteredSet;
        this.#changed();
      } catch (e) {
        console.error(e);
        window.alert('File parsing failed.');
      }
    };
    reader.readAsText(file);
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

  get currentSet() {
    return this.#displayedAttributes;
  }

  // private

  #changed(emit = true) {
    // storage
    window.localStorage.setItem(
      displayedAttributes,
      JSON.stringify(this.#displayedAttributes)
    );
    // emit
    if (!emit) return;
    const customEvent = new CustomEvent(event.changeDisplayedAttributeSet, {
      detail: [...this.#displayedAttributes],
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }
}

export default new AttributesManager();
