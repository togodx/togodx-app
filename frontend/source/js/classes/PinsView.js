import DefaultEventEmitter from "./DefaultEventEmitter";

const MIN_SIZE = 8;
const MAX_SIZE = 50;
const RANGE_SIZE = MAX_SIZE - MIN_SIZE;

export default class PinsView {

  #ROOT;

  constructor(elm) {
    console.log(elm)
    this.#ROOT = elm;

    DefaultEventEmitter.addEventListener('stickUserValue', e => {
      this.#stick(e.detail)

      // Element.getBoundingClientRect
    });
  }

  #stick(detail) {
    console.log(detail)
    const rect = detail.view.getBoundingClientRect();
    const ratio = detail.userValue.count / detail.value.count;
    const size = MIN_SIZE + RANGE_SIZE * ratio;
    console.log(rect)
    const pin = document.createElement('div');
    pin.classList.add('pin');
    pin.style.top = rect.top + 'px';
    pin.style.left = rect.left + 'px';
    pin.style.width = size + 'px';
    pin.style.height = size + 'px';
    this.#ROOT.insertAdjacentElement('beforeend', pin);

    console.log(ratio, Math.log10(ratio))

  }

}
