export default class ProgressIndicator {
  #TEXT_OFFSET;
  #TEXT_TOTAL;
  #TEXT_STATUS;
  #BAR;
  #totalDuration;
  #total;
  #simpleMode;

  /**
   * @param { HTMLElement } elm
   * @param { boolean } simpleMode - Default is mode with time bar and amount tracker
   */
  constructor(elm, simpleMode = false) {
    this.#simpleMode = simpleMode;
    elm.classList.add('progress-indicator');
    const counter = simpleMode
      ? ''
      : `<div class="amount-of-data">
          <span class="offset">0</span>
          <span class="total"></span>
      </div>`;
    elm.innerHTML = ` 
      <div class="text">
        ${counter}
        <div class="status">
        </div>
      </div>
      <div class="progress">
        <div class="bar"></div>
      </div>`;

    this.#BAR = elm.querySelector(':scope > .progress > .bar');
    this.#TEXT_STATUS = elm.querySelector(':scope > .text > .status');
    this.#total = 0;

    if (simpleMode) {
      elm.classList.add('-simple');
      return;
    }

    this.#TEXT_OFFSET = elm.querySelector(
      ':scope > .text > .amount-of-data > .offset'
    );
    this.#TEXT_TOTAL = elm.querySelector(
      ':scope > .text > .amount-of-data > .total'
    );
    this.#totalDuration = 0;
  }

  /* private methods */
  /**
   * @param { number } offset
   */
  #updateAmount(offset) {
    this.#TEXT_OFFSET.textContent = `${offset.toString()}`;
  }

  /**
   * @param { number } offset
   */
  #updateBarWidth(offset = 0) {
    this.#BAR.style.width =
      offset / this.#total ? `${(offset / this.#total) * 100}%` : '0%';
  }

  /**
   * @param { number } durationPerItem
   * @param { number } itemsLeft
   */
  #remainingTimeInSec(durationPerItem, itemsLeft) {
    return (durationPerItem * itemsLeft) / 1000 || 0;
  }

  /**
   * @param { number } time
   */
  #timeString(time) {
    if (time <= 0) return '0 sec.';

    let h, m, s;
    h = Math.floor(time / 3600);
    m = Math.floor((time % 3600) / 60);
    s = Math.floor((time % 3600) % 60);
    return h > 0 ? `${h} hr.` : m > 0 ? `${m} min.` : `${s} sec.`;
  }

  /**
   * @param { number } offset
   * @param { number } startTime - start time of 1 instance
   */
  #updateTime(offset, startTime) {
    this.#totalDuration += Date.now() - startTime;
    const remainingTime = this.#remainingTimeInSec(
      this.#totalDuration / offset,
      this.#total - offset
    );
    this.#TEXT_STATUS.innerHTML = this.#timeString(remainingTime);
  }

  /* public accessors */
  updateProgressBar({offset = 0, startTime}) {
    this.#updateBarWidth(offset);
    if (this.#simpleMode) return;

    this.#updateAmount(offset);
    this.#updateTime(offset, startTime);
  }

  setIndicator(total = 0, message = '') {
    this.#total = total;
    if (this.#simpleMode)
      this.#TEXT_STATUS.innerHTML = `${message}<span class="material-icons-outlined -rotating">autorenew</span>`;
    else this.#TEXT_TOTAL.textContent = `/ ${this.#total.toString()}`;
  }

  reset() {
    this.setIndicator();
    this.#updateBarWidth();
  }
}
