import DefaultEventEmitter from './DefaultEventEmitter.ts';
import * as event from '../events';

export default class BalloonView {
  #ROOT;
  #CONTAINER;

  constructor() {
    // make element
    this.#ROOT = document.createElement('div');
    this.#ROOT.className = 'balloon-view';
    document
      .querySelector('body')
      .insertAdjacentElement('beforeend', this.#ROOT);
    this.#ROOT.innerHTML = '<div class="container"></div>';
    this.#CONTAINER = this.#ROOT.querySelector(':scope > .container');

    // event listener
    DefaultEventEmitter.addEventListener(
      event.enterAttributeFilterItemView,
      ({detail: {elm, label, values}}) => {
        this.#CONTAINER.innerHTML = `
        <header>${label}</header>
        ${values
          .map(
            value => `<dl>
          <dt>${value.key}:</dt>
          <dd>${value.value}</dd>
        </dl>`
          )
          .join('')}`;
        // geography
        const rect = elm.getBoundingClientRect();
        const isBelow = window.innerHeight * 0.3 > rect.top;
        this.#ROOT.style.left = rect.left + rect.width * 0.5 + 'px';
        if (isBelow) {
          this.#ROOT.classList.add('-below');
          this.#ROOT.style.top = rect.bottom + 'px';
        } else {
          this.#ROOT.classList.remove('-below');
          this.#ROOT.style.top = rect.top + 'px';
        }
        this.#ROOT.classList.add('-showing');
      }
    );
    DefaultEventEmitter.addEventListener(
      event.leaveAttributeFilterItemView,
      () => {
        this.#ROOT.classList.remove('-showing');
      }
    );
  }
}
