import DefaultEventEmitter from './DefaultEventEmitter.ts';
import Records from './Records.ts';
import * as events from '../events';
import {currentAttributeSet} from '../functions/localStorage.ts';
import {PresetMetaDatum, Preset} from '../interfaces.ts';
import axios from 'axios';

class PresetManager {
  #currentAttributeSet: string[] = [];
  #presetMetaData: PresetMetaDatum[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // public

  async init(api: string): Promise<void> {
    // Determine display attribute information. If data is available in local storage, use it; if not, query the API.

    // fetch from local storage
    const json: string =
    window.localStorage.getItem(currentAttributeSet) || '[]';
    const storagedDisplayAttributes: string[] = JSON.parse(json);

    // fetch presets
    await fetch(api)
      .then(res => res.json())
      .then((presets: PresetMetaDatum[]) => {
        this.#presetMetaData = presets;
        const customEvent = new CustomEvent(events.loadedPresets, {detail: presets});
        DefaultEventEmitter.dispatchEvent(customEvent);
    });

    if (storagedDisplayAttributes.length > 0) {
      this.#currentAttributeSet = storagedDisplayAttributes;
    } else {
      // get default preset
      this.#currentAttributeSet = this.#presetMetaData[0].attributeSet;
    }
  }

  // Returns whether the attribute is included in the display attribute list.
  containsInDisplayedAttributes(id: string): boolean {
    return this.#currentAttributeSet.indexOf(id) >= 0;
  }

  /**
   *
   * @param {Map} differenceData
   */
  updateByDifferenceData(differenceData: Map<string, boolean>): void {
    differenceData.forEach((isDisplay, id) => {
      const index = this.#currentAttributeSet.indexOf(id);
      if (index === -1) {
        if (isDisplay) this.#currentAttributeSet.push(id);
      } else {
        if (!isDisplay) this.#currentAttributeSet.splice(index, 1);
      }
    });
    this.#changed(false);
  }

  // updateBySetLabel(label: string): void {
  //   console.log(label);
  //   const set = this.#presetMetaData.find(set => set.label === label)?.set;
  //   if (set) {
  //     this.#currentAttributeSet = [...set];
  //     this.#changed();
  //   }
  // }

  async loadPreset(url: string): Promise<Preset[]> {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    const presets: Preset[] = await axios
      .get(url)
      .then(res => res.data)
      .catch(err => {
        console.error(err);
        return Promise.reject();
      });
    return presets;
  }

  importSet(file: File): void {
    const reader = new FileReader();
    reader.onerror = () => {
      window.alert('Failed to load.');
    };
    reader.onload = (e: ProgressEvent) => {
      try {
        const fileReader: FileReader = <FileReader>e.target;
        const presets: Preset[] = JSON.parse(<string>fileReader.result);
        presets.forEach(preset => {
          const customEvent = new CustomEvent(events.addCondition, {detail: preset});
          DefaultEventEmitter.dispatchEvent(customEvent);
        });
      } catch (e) {
        console.error(e);
        window.alert('File parsing failed.');
      }
    };
    reader.readAsText(file);
  }

  // downloadCurrentSet(): void {
  //   const str = JSON.stringify(this.#currentAttributeSet, null, ' ');
  //   download(str, 'json', 'attributes_set.json', true);
  // }

  get presetMetaData(): PresetMetaDatum[] {
    return this.#presetMetaData;
  }

  get currentAttributeSet(): string[] {
    return [...this.#currentAttributeSet];
  }

  set currentAttributeSet(set: string[]) {
    const existingIds: string[] = Records.attributes.map(attribute => attribute.id);
    const filteredSet = set.filter(id => existingIds.indexOf(id) >= 0);
    this.#currentAttributeSet = [...filteredSet];
    this.#changed();
  }

  // private

  #changed(emit = true): void {
    // storage
    window.localStorage.setItem(
      currentAttributeSet,
      JSON.stringify(this.#currentAttributeSet)
    );
    // emit
    if (!emit) return;
    const customEvent = new CustomEvent(events.changeDisplayedAttributeSet, {
      detail: [...this.#currentAttributeSet],
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }
}

export default new PresetManager();
