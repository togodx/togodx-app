import ModalWindowView from './ModalWindowView';
import AttributesManager from './AttributesManager';

export default class SettingsView extends ModalWindowView {
  #isRendered = false;

  constructor() {
    super();

    this._ROOT.id = 'SettingsView';

    document
      .querySelector('#MiscArea > button')
      .addEventListener('click', () => {
        this.#render();
        this._open();
      });
  }

  #render() {
    if (this.#isRendered) return;
    this.#isRendered = true;

    this._TITLE.textContent = 'Settings';
    this._BODY.innerHTML = `<section>
      <h3>Attribute set</h3>
      <section>
        <h4>Select set</h4>
        <select id="SettingsAttributeSelectSets">
          <option></option>
          ${AttributesManager.sets
            .map(set => `<option value="${set.label}">${set.label}</option>`)
            .join('')}
        </select>
      </section>
    </section>`;

    // events
    document
      .getElementById('SettingsAttributeSelectSets')
      .addEventListener('change', e => {
        const label = e.target.value;
        AttributesManager.updateBySetLabel(label);
      });
  }
}
