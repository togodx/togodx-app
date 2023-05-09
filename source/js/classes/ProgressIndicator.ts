
export enum ProgressIndicatorMode {
  SIMPLE = 'simple',
  DETAILED = 'detailed',
}

export default class ProgressIndicator {
  #ROOT: HTMLElement;
  #TEXT_OFFSET: HTMLSpanElement;
  #TEXT_TOTAL: HTMLSpanElement;
  #TEXT_STATUS: HTMLDivElement;
  #BAR: HTMLDivElement;
  #totalDuration: number;
  #total: number;
  #mode: ProgressIndicatorMode;
  #lastTime: number;

  /**
   * @param { HTMLElement } elm
   * @param { 'simple' | 'detailed' } mode - Default is detailed mode with time bar and amount tracker
   */
  constructor(elm: HTMLElement, mode: ProgressIndicatorMode = ProgressIndicatorMode.DETAILED) {
    this.#mode = mode;
    elm.classList.add('progress-indicator', `-${mode}`);
    const loadingIcon =
      mode === ProgressIndicatorMode.SIMPLE
        ? '<span class="material-icons -rotating">autorenew</span>'
        : '';
    const counter =
      mode === ProgressIndicatorMode.DETAILED
        ? `<div class="amount">
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
    this.#BAR = elm.querySelector<HTMLDivElement>(':scope > .progress > .bar')!;
    this.#TEXT_STATUS = elm.querySelector<HTMLDivElement>(':scope > .text > .status')!;
    this.#total = 0;

    if (mode === ProgressIndicatorMode.SIMPLE) return;

    const amount: HTMLDivElement = elm.querySelector<HTMLDivElement>(
      ':scope > .text > .amount'
    )!;
    this.#TEXT_OFFSET = amount.querySelector<HTMLSpanElement>(
      ':scope > span.offset'
    )!;
    this.#TEXT_TOTAL = amount.querySelector<HTMLSpanElement>(
      ':scope > span.total'
    )!;
    this.#totalDuration = 0;
  }

  /* private methods */
  /**
   * @param { number } offset
   */
  #updateAmount(offset: number): void {
    this.#TEXT_OFFSET.textContent = offset.toString();
  }

  /**
   * @param { number } offset
   */
  #updateBarWidth(offset:number = 0): void {
    this.#BAR.style.width =
      offset / this.#total ? `${(offset / this.#total) * 100}%` : '0%';
  }

  /**
   * @param { number } durationPerItem
   * @param { number } itemsLeft
   */
  #remainingTimeInSec(durationPerItem: number, itemsLeft: number): number {
    return (durationPerItem * itemsLeft) / 1000 || 0;
  }

  /**
   * @param { number } time
   */
  #timeString(time: number): string {
    if (time <= 0) return '0 sec.';

    const [h, m, s]: number[] = [
      Math.floor(time / 3600),
      Math.floor((time % 3600) / 60),
      Math.floor((time % 3600) % 60),
    ];
    return h > 0 ? `${h} hr.` : m > 0 ? `${m} min.` : `${s} sec.`;
  }

  /**
   * @param { number } offset
   * @param { number } startTime - start time of 1 instance
   */
  #updateTime(offset: number, startTime: number): void {
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
  #setMessage(message: string, isError: boolean): void {
    this.#TEXT_STATUS.childNodes[0].nodeValue = message;
    this.#ROOT.classList.toggle('error', isError);
  }

  /* public accessors */

  /**
   * @param { offset: number } progressInfo
   */
  updateProgressBar(offset: number = 0): void {
    const lastTime = this.#lastTime || Date.now();
    this.#updateBarWidth(offset);
    if (this.#mode === ProgressIndicatorMode.SIMPLE) return;

    this.#updateAmount(offset);
    this.#updateTime(offset, lastTime);
    this.#lastTime = Date.now();
  }

  /**
   * @param { string } message
   * @param { number } total
   * @param { boolean } isError
   */
  setIndicator(message: string = '', total: number = 0, isError: boolean = false): void {
    this.#total = total;
    if (this.#mode === ProgressIndicatorMode.SIMPLE) this.#setMessage(message, isError);
    else if (this.#mode === ProgressIndicatorMode.DETAILED)
      this.#TEXT_TOTAL.textContent = `/ ${this.#total.toString()}`;
  }

  reset(): void {
    this.setIndicator();
    this.#updateBarWidth();
  }
}
