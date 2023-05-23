type Position = {
  x: string | number | undefined;
  y: string | number | undefined;
}

export default class ModalWindowView {
  #ROOT: HTMLElement;
  #WINDOW: HTMLDivElement;
  #HEADER: HTMLElement;
  #TITLE: HTMLHeadingElement;
  #BODY: HTMLDivElement;
  #popupPosition: Position;
  #dragStartPosition: Position;
  #handleKeydown: Function;

  constructor() {
    this.#ROOT = document.createElement('section');
    this.#ROOT.classList.add('modal-window-view');
    document.body.append(this.#ROOT);
    this.#ROOT.innerHTML = `<div class="window">
      <header>
        <h2 class="title"></h2>
        <div class="close-button-view"></div>
      </header>
      <div class="body"></div>
    </div>`;

    this.#popupPosition = {x: undefined, y: undefined};

    // references
    this.#WINDOW = this.#ROOT.querySelector(':scope > .window')!;
    this.#HEADER = this.#WINDOW.querySelector(':scope > header')!;
    this.#TITLE = this.#HEADER.querySelector(':scope > .title')!;
    const closeButton: HTMLButtonElement = this.#HEADER.querySelector(
      ':scope > .close-button-view'
    )!;
    this.#BODY = this.#WINDOW.querySelector(':scope > .body')!;

    // attach event
    closeButton.addEventListener('click', () => this._close());
    this.#ROOT.addEventListener('click', () => this._close());
    this.#WINDOW.addEventListener('click', e => {
      e.stopPropagation();
    });
    this.#HEADER.addEventListener('mousedown', this.#startDrag.bind(this));
  }

  // protected methods

  protected _open() {
    this.#ROOT.classList.add('-opened');
    // key event
    this.#handleKeydown = this.#keydown.bind(this);
    document.addEventListener('keydown', this.#handleKeydown);
  }

  protected _close(exitingPopup = true) {
    // reset popup to the center if it is shown for first time
    // keep moved axes if user has dragged popup while moving with arrows
    const popupStyle = this.#WINDOW.style;
    this.#popupPosition.y = exitingPopup ? '' : popupStyle?.top;
    this.#popupPosition.x = exitingPopup ? '' : popupStyle?.left;

    this._ROOT.classList.remove('-opened');
    // this.#TITLE.textContent = '';
    // this.#BODY.textContent = '';
    document.removeEventListener('keydown', this.#handleKeydown);
  }

  protected get _ROOT() {
    return this.#ROOT;
  }

  protected get _WINDOW() {
    return this.#WINDOW;
  }

  protected get _HEADER() {
    return this.#HEADER;
  }

  protected get _TITLE() {
    return this.#TITLE;
  }

  protected get _BODY() {
    return this.#BODY;
  }

  // private methods

  #startDrag(e: DragEvent) {
    this.#WINDOW.classList.add('-dragging');
    this.#dragStartPosition = {
      x: e.clientX,
      y: e.clientY,
    };

    const dragging = (e: DragEvent): void => {
      const dx = e.clientX - Number(this.#dragStartPosition.x);
      const dy = e.clientY - Number(this.#dragStartPosition.y);

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

  #keydown(e: KeyboardEvent) {
    if (e.key == 'Escape') {
      this._close();
    }
  }
}
