import DefaultEventEmitter from "./DefaultEventEmitter";

export default class BalloonView {

  #ROOT;
  #CONTAINER;

  constructor() {

    // make element
    this.#ROOT = document.createElement('div');
    this.#ROOT.className = 'balloon-view';
    document.querySelector('body').insertAdjacentElement('beforeend', this.#ROOT);
    this.#ROOT.innerHTML = '<div class="container"></div>';
    this.#CONTAINER = this.#ROOT.querySelector(':scope > .container');

    // event listener
    DefaultEventEmitter.addEventListener('enterPropertyValueItemView', e => {
      this.#CONTAINER.innerHTML = `
        <header>${e.detail.label}</header>
        ${e.detail.values.map(value => `<dl>
          <dt>${value.key}:</dt>
          <dd>${value.value}</dd>
        </dl>`).join('')}`;
      // geography
      const rect = e.detail.elm.getBoundingClientRect();
      const isBelow = window.innerHeight * .3 > rect.top;
      this.#ROOT.style.left = (rect.left + rect.width * .5) + 'px';
      if (isBelow) {
        this.#ROOT.classList.add('-below');
        this.#ROOT.style.top = (rect.top + 10) + 'px';
      } else {
        this.#ROOT.classList.remove('-below');
        this.#ROOT.style.top = rect.top + 'px';
      }
      this.#ROOT.classList.add('-showing');
    });
    DefaultEventEmitter.addEventListener('leavePropertyValueItemView', e => {
      this.#ROOT.classList.remove('-showing');
    });
  }

}