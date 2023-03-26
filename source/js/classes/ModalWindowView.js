export default class ModalWindowView {
  #ROOT;
  #EXIT_BUTTON;
  #WINDOW;
  #popupPosition;
  #handleKeydown;

  constructor() {
    this.#ROOT = document.createElement('section');
    this.#ROOT.classList.add('modal-window-view');
    document.querySelector('body').append(this.#ROOT);

    this.#EXIT_BUTTON = document.createElement('div');
    this.#EXIT_BUTTON.className = 'close-button-view';

    this.#EXIT_BUTTON.addEventListener('click', () => {
      // DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));
    });

    this.#popupPosition = {x: undefined, y: undefined};
  }

  // protected methods

  _getWindow() {
    const popup = document.createElement('div');
    popup.className = 'window';
    popup.style.left = this.#popupPosition.x;
    popup.style.top = this.#popupPosition.y;
    this._ROOT.appendChild(popup);
    return popup;
  }

  _show() {
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

    this._ROOT.classList.remove('-backdropping');
    this._ROOT.innerHTML = '';
    document.removeEventListener('keydown', this.#handleKeydown);
  }

  get _ROOT() {
    return this.#ROOT;
  }

  // private methods

  #keydown(e) {
    if (e.key == 'Escape') {
      this._close();
    }
  }
}
