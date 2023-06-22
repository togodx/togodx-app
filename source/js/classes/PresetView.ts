import ModalWindowView from './ModalWindowView.ts';
import PresetManager from './PresetManager.ts';
import {Preset} from '../interfaces.ts';

export default class PresetView extends ModalWindowView {
  #isRendered = false;

  constructor() {
    super();

    this._ROOT.id = 'PresetView';

    // TODO: 暫定的な呼び出し
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
    (sections[0])
      .querySelector(':scope > input')!
      .addEventListener('change', e => {
        const input: HTMLInputElement = e.target as HTMLInputElement;
        const file = input.files![0];
        if (!file) return;
        PresetManager.importSet(file);
        this._close();
      });
  }
}
