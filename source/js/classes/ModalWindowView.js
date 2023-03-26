export default class ModalWindowView {
  #ROOT;
  #EXIT_BUTTON;
  #popupPosition;

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

  _popup(detail) {
    // this._ROOT.dataset.categoryId = detail.togoKeyView.dataset.categoryId;
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.left = this.#popupPosition.x;
    popup.style.top = this.#popupPosition.y;
    // popup.appendChild(this.#header(detail.togoKeyView));
    // popup.appendChild(this.#container(detail.togoKeyView));
    return popup;
  }

  _hide(exitingPopup = true) {
    // reset popup to the center if it is shown for first time
    // keep moved axes if user has dragged popup while moving with arrows
    const popupStyle = this._ROOT.querySelector('.popup')?.style;
    this.#popupPosition.y = exitingPopup ? '' : popupStyle?.top;
    this.#popupPosition.x = exitingPopup ? '' : popupStyle?.left;

    this._ROOT.classList.remove('-backdropping');
    this._ROOT.innerHTML = '';
    // document.removeEventListener('keydown', this.#handleKeydown);
  }

  get _ROOT() {
    return this.#ROOT;
  }
}
