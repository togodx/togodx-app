export default class ModalWindowView {
  #ROOT;
  #EXIT_BUTTON;
  #WINDOW;
  #HEADER;
  #TITLE;
  #BODY;
  #popupPosition;
  #handleKeydown;

  constructor() {
    this.#ROOT = document.createElement('section');
    this.#ROOT.classList.add('modal-window-view');
    document.querySelector('body').append(this.#ROOT);
    this.#ROOT.innerHTML = `<div class="window">
      <header>
        <div class="title"></div>
        <div class="close-button-view"></div>
      </header>
      <div class="container"></div>
    </div>`;

    this.#EXIT_BUTTON = document.createElement('div');
    this.#EXIT_BUTTON.className = 'close-button-view';
    this.#EXIT_BUTTON.addEventListener('click', () => {
      this._hide();
      // DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));
    });

    this.#popupPosition = {x: undefined, y: undefined};

    // references
    this.#WINDOW = this.#ROOT.querySelector(':scope > .window');
    this.#HEADER = this.#WINDOW.querySelector(':scope > header');
    this.#TITLE = this.#HEADER.querySelector(':scope > .title');
    this.#BODY = this.#WINDOW.querySelector(':scope > .container');
  }

  // protected methods

  _getWindow() {
    // this.#WINDOW.textContent = '';
    return this.#WINDOW;
  }

  _open() {
    // key event
    this.#handleKeydown = this.#keydown.bind(this);
    document.addEventListener('keydown', this.#handleKeydown);
  }

  _close(exitingPopup = true) {
    // reset popup to the center if it is shown for first time
    // keep moved axes if user has dragged popup while moving with arrows
    const popupStyle = this._ROOT.querySelector('.window')?.style;
    this.#popupPosition.y = exitingPopup ? '' : popupStyle?.top;
    this.#popupPosition.x = exitingPopup ? '' : popupStyle?.left;

    this._ROOT.classList.remove('-opened');
    this.#TITLE.textContent = '';
    this.#BODY.textContent = '';
    document.removeEventListener('keydown', this.#handleKeydown);
  }

  get _ROOT() {
    return this.#ROOT;
  }

  get _HEADER() {
    return this.#HEADER;
  }

  get _TITLE() {
    return this.#TITLE;
  }

  get _BODY() {
    return this.#BODY;
  }

  // private methods

  #keydown(e) {
    if (e.key == 'Escape') {
      this._close();
    }
  }
}
