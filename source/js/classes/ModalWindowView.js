export default class ModalWindowView {
  #ROOT;
  #WINDOW;
  #HEADER;
  #TITLE;
  #BODY;
  #popupPosition;
  #dragStartPosition;
  #handleKeydown;

  constructor() {
    this.#ROOT = document.createElement('section');
    this.#ROOT.classList.add('modal-window-view');
    document.querySelector('body').append(this.#ROOT);
    this.#ROOT.innerHTML = `<div class="window">
      <header>
        <h2 class="title"></h2>
        <div class="close-button-view"></div>
      </header>
      <div class="body"></div>
    </div>`;

    this.#popupPosition = {x: undefined, y: undefined};

    // references
    this.#WINDOW = this.#ROOT.querySelector(':scope > .window');
    this.#HEADER = this.#WINDOW.querySelector(':scope > header');
    this.#TITLE = this.#HEADER.querySelector(':scope > .title');
    const closeButton = this.#HEADER.querySelector(
      ':scope > .close-button-view'
    );
    this.#BODY = this.#WINDOW.querySelector(':scope > .body');

    // attach event
    closeButton.addEventListener('click', () => this._close());
    this.#ROOT.addEventListener('click', () => this._close());
    this.#WINDOW.addEventListener('click', e => {
      e.stopPropagation();
    });
    this.#HEADER.addEventListener('mousedown', this.#startDrag.bind(this));
  }

  // protected methods

  _open() {
    this.#ROOT.classList.add('-opened');
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
    // this.#TITLE.textContent = '';
    // this.#BODY.textContent = '';
    document.removeEventListener('keydown', this.#handleKeydown);
  }

  get _ROOT() {
    return this.#ROOT;
  }

  get _WINDOW() {
    return this.#WINDOW;
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

  #startDrag(e) {
    this.#WINDOW.classList.add('-dragging');
    this.#dragStartPosition = {
      x: e.clientX,
      y: e.clientY,
    };

    const dragging = e => {
      const dx = e.clientX - this.#dragStartPosition.x;
      const dy = e.clientY - this.#dragStartPosition.y;

      this.#WINDOW.style.top = `${this.#WINDOW.offsetTop + dy}px`;
      this.#WINDOW.style.left = `${this.#WINDOW.offsetLeft + dx}px`;

      this.#dragStartPosition.x = e.clientX;
      this.#dragStartPosition.y = e.clientY;
    };
    const endDrag = () => {
      this.#WINDOW.classList.remove('-dragging');
      document.removeEventListener('mousemove', dragging);
      document.removeEventListener('mouseup', endDrag);
    };

    document.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', endDrag);
  }

  #keydown(e) {
    if (e.key == 'Escape') {
      this._close();
    }
  }
}