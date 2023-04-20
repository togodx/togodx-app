import { PresetMetaData } from './../interfaces';
import ModalWindowView from './ModalWindowView';
import AttributesManager from './AttributesManager';
import {Preset} from '../interfaces';

export default class PresetView extends ModalWindowView {
  #isRendered = false;

  constructor() {
    super();

    this._ROOT.id = 'PresetView';

    document
      .querySelector('#ImportConditionButton')!
      .addEventListener('click', () => {
        this.#render();
        this._open();
      });
  }

  #render() {
    if (this.#isRendered) return;
    this.#isRendered = true;

    this._TITLE.textContent = 'Import';
    this._BODY.innerHTML = `<section>
      <!--<h3><span>Attributes set</span></h3>-->
      <section>
        <h4>Select set</h4>
        <nav>
          ${AttributesManager.presetMetaData
            .map(preset => `<dl data-url="${preset.url}">
              <dt>${preset.label}</dt>
              <dd>${preset.description}</dd>
            </dl>`)
            .join('')}
        </nav>
      </section>
      <section>
        <h4>Import set</h4>
        <input type="file" id="SettingsAttributeImportSet" accept=".json" />
      </section>
      <!--
      <section>
        <h4>Export set</h4>
        <button id="SettingsAttributeExportSet" class="rounded-button-view -small">Download</button>
      </section>
      -->
    </section>`;

    // events
    const sections = this._BODY.querySelectorAll(':scope > section > section');
    sections[0]
      .querySelectorAll<HTMLDListElement>(':scope > nav > dl')
      .forEach(dl => {
        dl.addEventListener('click', e => {
          const url = dl.dataset.url!;
          this.#loadPreset(url);
        });
      })
      // .addEventListener('click', e => {
      //   console.log(e)
      //   // const label = e.target.value;
      //   // AttributesManager.updateBySetLabel(label);
      // });
    sections[1]
      .querySelector(':scope > input')
      .addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        AttributesManager.importSet(file);
      });
    // sections[2]
    //   .querySelector(':scope > button')
    //   .addEventListener('click', () => {
    //     AttributesManager.downloadCurrentSet();
    //   });
  }

  async #loadPreset(url: string): Promise<void>{
    console.log(url)

  }
}