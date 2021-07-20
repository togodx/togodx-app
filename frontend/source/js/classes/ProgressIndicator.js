export default class ProgressIndicator {
  #TEXT_OFFSET;
  #TEXT_TOTAL;
  #TEXT_TIME;
  #BAR;
  #totalDuration;
  #total;

  constructor(elm) {
    elm.classList.add('progress-indicator');
    elm.innerHTML = `
      <div class="text">
        <div class="amount-of-data">
          <span class="offset">0</span>
            / 
          <span class="total"></span> 
        </div>
        <div class="remaining-time">
        </div>
      </div>
      <div class="progress">
        <div class="bar"></div>
      </div>
      `;

    this.#TEXT_TIME = elm.querySelector(':scope > .text > .remaining-time');
    this.#TEXT_OFFSET = elm.querySelector(
      ':scope > .text > .amount-of-data > .offset'
    );
    this.#TEXT_TOTAL = elm.querySelector(
      ':scope > .text > .amount-of-data > .total'
    );
    this.#BAR = elm.querySelector(':scope > .progress > .bar');
    this.#totalDuration = 0;
    this.#total = 0;
  }
  /* private methods */
  /**
   * @param { number } offset
   */
  #updateAmount(offset) {
    this.#TEXT_OFFSET.textContent = `${offset.toString()}`;
    this.#BAR.style.width = `${(offset / this.#total) * 100}%`;
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
   * @param { number } startTime - start time of 1 getProperties
   */
  #updateTime(offset, startTime) {
    this.#totalDuration += Date.now() - startTime;
    const remainingTime = this.#remainingTimeInSec(
      this.#totalDuration / offset,
      this.#total - offset
    );
    this.#TEXT_TIME.innerHTML = this.#timeString(remainingTime);
  }

  /* public accessors */
  updateProgressBar({offset, startTime}) {
    this.#updateAmount(offset);
    this.#updateTime(offset, startTime);
  }

  setTotal(total) {
    this.#total = total;
    this.#TEXT_TOTAL.textContent = this.#total.toString();
  }
}
