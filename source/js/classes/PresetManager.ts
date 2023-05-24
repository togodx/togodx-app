import DefaultEventEmitter from './DefaultEventEmitter.ts';
import Records from './Records.ts';
import {currentAttributeSet} from '../functions/localStorage.ts';
import * as event from '../events';
import {PresetMetaDatum, Preset} from '../interfaces.ts';
// import {download} from '../functions/util';

class PresetManager {
  #currentAttributeSet: string[];
  #presetMetaData: PresetMetaDatum[];

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
      })
      .catch(() => {
        this.#presetMetaData = [];
        this.#currentAttributeSet = [];
      });

    if (storagedDisplayAttributes.length > 0) {
      this.#currentAttributeSet = storagedDisplayAttributes;
    } else {
      // get default preset
      // TODO: 暗黙的にデフォルトデータとしているので、あまり筋がよろしくない
      const preset = await fetch(this.#presetMetaData[0].url)
        .then(res => res.json());
        this.#currentAttributeSet = preset[0].attributeSet;
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

  importSet(file: File): void {
    const reader = new FileReader();
    reader.onerror = e => {
      window.alert('Failed to load.');
    };
    reader.onload = (e: ProgressEvent) => {
      try {
        const fileReader: FileReader = <FileReader>e.target!;
        const presets: Preset[] = JSON.parse(<string>fileReader.result);
        presets.forEach(preset => {
          const customEvent = new CustomEvent(event.addCondition, {detail: preset});
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
    const customEvent = new CustomEvent(event.changeDisplayedAttributeSet, {
      detail: [...this.#currentAttributeSet],
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }
}

export default new PresetManager();
