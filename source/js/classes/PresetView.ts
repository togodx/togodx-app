import ModalWindowView from './ModalWindowView.ts';
import PresetManager from './PresetManager.ts';

export default class PresetView extends ModalWindowView {
  // TODO: もはや「Preset」ではないのでは？
  #isRendered = false;

  constructor() {
    super();

    this._ROOT.id = 'PresetView';

    // TODO: 暫定的な呼び出し
    const button = document.querySelector('#ImportConditionButton') as HTMLButtonElement;
    button.addEventListener('click', () => {
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
        <div class="option">
          <input type="radio" id="SettingsAttributeImportSet_option1" name="SettingsAttributeImportSet_option" value="add" checked />
          <label for="SettingsAttributeImportSet_option1">Add</label>
          <input type="radio" id="SettingsAttributeImportSet_option2" name="SettingsAttributeImportSet_option" value="overwrite" />
          <label for="SettingsAttributeImportSet_option2">Overwrite</label>
        </div>
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
    const inputFile = sections[0].querySelector(':scope > input[type="file"]') as HTMLInputElement;
    console.log(inputFile)
    inputFile.addEventListener('change', e => {
      const input: HTMLInputElement = e.target as HTMLInputElement;
      console.log(input, inputFile)
      console.log(input === inputFile)
      const selectedRadio = sections[0].querySelector(':scope > .option > input[name="SettingsAttributeImportSet_option"]:checked');
      
      console.log( selectedRadio )
      const file = input.files![0];
      if (!file) return;
      PresetManager.importSet(file);
      this._close();
    });
  }
}
