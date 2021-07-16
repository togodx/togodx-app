import ConditionBuilder from "./ConditionBuilder";

export default class HistogramRangeSelectorController {

  #target;
  #selection;
  #unit;
  #SELECTING_AREA;
  #SELECTOR_BARS;

  constructor(target, selector) {

    // definition
    this.#target = target;
    let selectionStart, selectionEnd;
    const self = this;
    this.#selection = {};
    Object.defineProperties(this.#selection, {
      start: {
        get() {
          return selectionStart;
        },
        set(value) {
          selectionStart = value;
        }
      },
      end: {
        get() {
          return selectionEnd;
        },
        set(value) {
          selectionEnd = value;
        }
      },
      range: {
        get() {
          return [selectionStart, selectionEnd];
        },
        set([start, end]) {
          selectionStart = start;
          selectionEnd = end;
          self.#update();
        }
      }
    });

    // reference
    this.#SELECTING_AREA = selector.querySelector(':scope > .inner > .selectingarea');
    const handlesArray = Array.from(this.#SELECTING_AREA.querySelectorAll(':scope > .handle'));
    console.log(handlesArray)
    const handles = {
      left: handlesArray.filter(handle => handle.dataset.direction === 'left'),
      right: handlesArray.filter(handle => handle.dataset.direction === 'right')
    }
    console.log(handles)
    const selectorController = selector.querySelector(':scope > .inner > .controller');
    this.#SELECTOR_BARS = selector.querySelectorAll(':scope > .inner > .overview > .bar');

    // make selecting area
    let isMouseDown = false, startX, width, unit;
    selectorController.addEventListener('mousedown', e => {
      selector.classList.add('-makingarea');
      width = e.target.getBoundingClientRect().width;
      this.#unit = 100 / target.items.length;
      isMouseDown = true;
      startX = (e.layerX / width) * 100;
    });
    selectorController.addEventListener('mousemove', e => {
      if (isMouseDown) {
        // calculate selection range
        const x = (e.layerX / width) * 100;
        const selectedWidth = x - startX;
        if (selectedWidth > 0) {
          this.#selection.range = [
            Math.floor(startX / this.#unit),
            Math.floor(x / this.#unit)
          ];
          // this.#selection.start = Math.floor(startX / this.#unit);
          // this.#selection.end = Math.floor(x / this.#unit)
        } else {
          this.#selection.range = [
            Math.floor(x / this.#unit),
            Math.floor(startX / this.#unit)
          ];
          // this.#selection.start = Math.floor(x / unit);
          // this.#selection.end = Math.floor(startX / unit)
        }
        // selecting area
        // this.#SELECTING_AREA.style.left = (this.start * unit) + '%';
        // this.#SELECTING_AREA.style.width = ((this.end - this.start) * unit) + '%';
      }
    });
    selectorController.addEventListener('mouseup', e => {
      if (isMouseDown) {
        selector.classList.remove('-makingarea');
        isMouseDown = false;
        ConditionBuilder.setPropertyValues(
          target.propertyId,
          this.selectedItems.map(item => item.categoryId)
        );
      }
    });

    // drag selecting area

    // resize selecting area
  }


  // private methods

  #update() {
    // selecting area
    this.#SELECTING_AREA.style.left = (this.start * this.#unit) + '%';
    this.#SELECTING_AREA.style.width = ((this.end - this.start + 1) * this.#unit) + '%';
    // overview
    this.#SELECTOR_BARS.forEach((bar, index) => {
      if (this.#selection.start <= index && index <= this.#selection.end) bar.classList.add('-selected');
      else bar.classList.remove('-selected');
    });
    this.#target.update();
    // set condition
    ConditionBuilder.setPropertyValues(
      this.#target.propertyId,
      this.selectedItems.map(item => item.categoryId),
      false
    );
  }


  // accessor

  get start() {
    return this.#selection.start;
  }

  get end() {
    return this.#selection.end;
  }

  get selectedItems() {
    const items = [];
    if (this.start !== 0 && this.end !== 0) {
      items.push(...this.#target.items.filter((item_, index) => {
        if (this.start <= index && index <= this.end) return true;
        else return false;
      }));
    }
    return items;
  }

}