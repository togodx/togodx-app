/**
 * @enum { string } MODE
 */
const MODE = {
  SIMPLE: 'simple',
  DETAILED: 'detailed',
};

export default class ProgressIndicator {
  #ROOT;
  #TEXT_OFFSET;
  #TEXT_TOTAL;
  #TEXT_STATUS;
  #BAR;
  #totalDuration;
  #total;
  #mode;

  /**
   * @param { HTMLElement } elm
   * @param { 'simple' | 'detailed' } mode - Default is detailed mode with time bar and amount tracker
   */
  constructor(elm, mode = MODE.DETAILED) {
    this.#mode = mode;
    elm.classList.add('progress-indicator', `-${mode}`);
    const loadingIcon =
      mode === MODE.SIMPLE
        ? '<span class="material-icons-outlined -rotating">autorenew</span>'
        : '';
    const counter =
      mode === MODE.DETAILED
        ? `<div class="amount-of-data">
          <span class="offset">0</span>
          <span class="total"></span>
      </div>`
        : '';
    elm.innerHTML = ` 
      <div class="text">
        ${counter}
        <div class="status">
          ${loadingIcon}
        </div>
      </div>
      <div class="progress">
        <div class="bar"></div>
      </div>`;

    this.#ROOT = elm;
    this.#BAR = elm.querySelector(':scope > .progress > .bar');
    this.#TEXT_STATUS = elm.querySelector(':scope > .text > .status');
    this.#total = 0;

    if (mode === MODE.SIMPLE) return;

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

  /**
   * @param { string } message
   * @param { boolean } isError
   */
  #setMessage(message, isError) {
    this.#TEXT_STATUS.childNodes[0].nodeValue = message;
    isError ? this.#ROOT.classList.add('error') : this.#ROOT.classList.remove('error');
  }

  /* public accessors */

  /**
   * @param { {offset: number, startTime: number} } progressInfo
   */
  updateProgressBar({offset = 0, startTime}) {
    this.#updateBarWidth(offset);
    if (this.#mode === MODE.SIMPLE || !startTime) return;

    this.#updateAmount(offset);
    this.#updateTime(offset, startTime);
  }

  /**
   * @param { string } message
   * @param { number } total
   * @param { boolean } isError
   */
  setIndicator(message = '', total = 0, isError = false) {
    this.#total = total;
    if (this.#mode === MODE.SIMPLE) this.#setMessage(message, isError);
    else if (this.#mode === MODE.DETAILED)
      this.#TEXT_TOTAL.textContent = `/ ${this.#total.toString()}`;
  }

  reset() {
    this.setIndicator();
    this.#updateBarWidth();
  }
}
