export default class ModalWindowView {
  #ROOT;

  constructor() {
    // this.#modal = document.querySelector('#Modal');
    // this.#modalInner = document.querySelector('#Modal > .inner');
    // this.#modalTitle = document.querySelector('#Modal > .inner > header > h2');
    // this.#modalContent = document.querySelector('#Modal > .inner > .content');
    // this.#modalClose = document.querySelector('#Modal > .inner > header > .close');
    // this.#modalClose.addEventListener('click', () => {
    //   this.#modal.classList.remove('-show');
    // });

    this.#ROOT = document.createElement('section');
    this.#ROOT.classList.add('modal-window-view');
    document.querySelector('body').append(this.#ROOT);
  }

  // public methods

  get ROOT() {
    return this.#ROOT;
  }
}
