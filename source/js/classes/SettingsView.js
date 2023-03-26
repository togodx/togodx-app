import ModalWindowView from './ModalWindowView';

export default class SettingsView extends ModalWindowView {
  #isRendered = false;

  constructor() {
    super();

    this._ROOT.id = 'SettingsView';

    document
      .querySelector('#MiscArea > button')
      .addEventListener('click', () => {
        console.log('click!');
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
    </section>`;
  }
}
