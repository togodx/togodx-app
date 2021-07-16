const startTime = Date.now();

export default class ProgressBar {
  #ROOT;
  #TEXT_AMOUNT;
  #TEXT_TIME;
  #BAR;

  constructor(elm) {
    elm.innerHTML = `
    <div class="indicator">
      <div class="text">
        <div class="amount-of-data"></div>
        <div class="remaining-time"></div>
      </div>
      <div class="progress">
        <div class="bar"></div>
      </div>
    </div>`;

    this.#ROOT = elm;
    this.#TEXT_AMOUNT = elm.querySelector(':scope > .text > .amount-of-data');
    this.#TEXT_TIME = elm.querySelector(':scope > .text > .remaining-time');
    this.#BAR = elm.querySelector(':scope > .progress > .bar');
  }
  /**
   * @param { HTMLElement } target
   * @param { number } total
   * @param { number } offset
   */
  #setProgressBar(target, total, offset) {
    target.textContent = `${offset.toString()} / ${total.toString()}`;
    target.style.width = `${(this.offset / this.#queryIds.length) * 100}%`;
  }

  #updateRemainingTime() {
    let singleTime = (Date.now() - startTime) / this.offset;
    let remainingTime;
    if (this.offset == 0) {
      remainingTime = '';
    } else if (this.offset >= this.#queryIds.length) {
      remainingTime = 0;
    } else {
      remainingTime =
        (singleTime *
          this.#queryIds.length *
          (this.#queryIds.length - this.offset)) /
        this.#queryIds.length /
        1000;
    }

    if (remainingTime >= 3600) {
      this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.round(
        remainingTime / 3600
      )} hr.`;
    } else if (remainingTime >= 60) {
      this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.round(
        remainingTime / 60
      )} min.`;
    } else if (remainingTime >= 0) {
      this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.floor(remainingTime)} sec.`;
    } else {
      this.#INDICATOR_TEXT_TIME.innerHTML = ``;
    }
    // return HTMLElement;
  }
}
