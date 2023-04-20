import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import {displayedAttributes} from '../functions/localStorage.js';
import * as event from '../events';
import {PresetMetaDatum} from '../interfaces';
import {download} from '../functions/util';

class PresetManager {
  #displayedAttributes: string[];
  #presetMetaData: PresetMetaDatum[];

  constructor() {}

  // public

  async init(api: string): Promise<void> {
    // Determine display attribute information. If data is available in local storage, use it; if not, query the API.

    // fetch from local storage
    const json: string =
    window.localStorage.getItem(displayedAttributes) || '[]';
    const storagedDisplayAttributes: string[] = JSON.parse(json);

    // fetch presets
    await fetch(api)
      .then(res => res.json())
      .then((presets: PresetMetaDatum[]) => {
        this.#presetMetaData = presets;
      })
      .catch(() => {
        this.#presetMetaData = [];
        this.#displayedAttributes = [];
      });

    if (storagedDisplayAttributes.length > 0) {
      this.#displayedAttributes = storagedDisplayAttributes;
    } else {
      // get default preset
      // TODO: 暗黙的にデフォルトデータとしているので、あまり筋がよろしくない
      const preset = await fetch(this.#presetMetaData[0].url)
        .then(res => res.json());
        this.#displayedAttributes = preset[0].attributeSet;
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

  // updateBySetLabel(label: string): void {
  //   console.log(label);
  //   const set = this.#presetMetaData.find(set => set.label === label)?.set;
  //   if (set) {
  //     this.#displayedAttributes = [...set];
  //     this.#changed();
  //   }
  // }

  importSet(file: File): void {
    const reader = new FileReader();
    reader.onerror = e => {
      window.alert('Failed to load.');
    };
    reader.onload = (e: ProgressEvent) => {
      try {
        const fileReader: FileReader = <FileReader>e.target!;
        const set: string[] = JSON.parse(<string>fileReader.result);
        const existingIds: string[] = Records.attributes.map(attribute => attribute.id);
        const filteredSet = set.filter(id => existingIds.indexOf(id) >= 0);
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

  // downloadCurrentSet(): void {
  //   const str = JSON.stringify(this.#displayedAttributes, null, ' ');
  //   download(str, 'json', 'attributes_set.json', true);
  // }

  get presetMetaData(): PresetMetaDatum[] {
    return this.#presetMetaData;
  }

  get currentSet(): string[] {
    return this.#displayedAttributes;
  }

  // private

  #changed(emit = true): void {
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

export default new PresetManager();
