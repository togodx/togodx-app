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
    this.#unit = 100 / target.items.length;
    this.#selection = {};
    this.#defineSelection();

    // reference
    this.#SELECTING_AREA = selector.querySelector(':scope > .inner > .selectingarea');
    const handlesArray = Array.from(this.#SELECTING_AREA.querySelectorAll(':scope > .handle'));
    const handles = {
      left: handlesArray.filter(handle => handle.dataset.direction === 'left'),
      right: handlesArray.filter(handle => handle.dataset.direction === 'right')
    }
    this.#SELECTOR_BARS = selector.querySelectorAll(':scope > .inner > .overview > .bar');

    this.#defineInteraction(selector);
  }


  // private methods

  #defineSelection() {
    let selectionStart, selectionEnd;
    const self = this;
    Object.defineProperties(this.#selection, {
      start: {
        get() {
          return selectionStart;
        },
        set(value) {
          if (selectionStart !== value) {
            selectionStart = value;
            self.#update();
          }
        }
      },
      end: {
        get() {
          return selectionEnd;
        },
        set(value) {
          if (selectionEnd !== value) {
            selectionEnd = value;
            self.#update();
          }
        }
      },
      range: {
        get() {
          return [selectionStart, selectionEnd];
        },
        set([start, end]) {
          if (selectionStart !== start || selectionEnd !== end) {
            selectionStart = start;
            selectionEnd = end;
            self.#update();
          }
        }
      }
    });
  }

  #defineInteraction(selector) {

    const selectorController = selector.querySelector(':scope > .inner > .controller');
    let isMouseDown = false, startX, initialStart, initialWidth, totalWidth, interactionType;

    // make selecting area
    selectorController.addEventListener('mousedown', e => {
      console.log(e)
      e.stopImmediatePropagation();
      interactionType = 'make';
      selector.classList.add('-makingarea');
      totalWidth = selectorController.getBoundingClientRect().width;
      isMouseDown = true;
      const x = e.x - selectorController.getBoundingClientRect().x;
      startX = (x / totalWidth) * 100;
    });

    // drag selecting area
    this.#SELECTING_AREA.addEventListener('mousedown', e => {
      console.log(e)
      e.stopImmediatePropagation();
      interactionType = 'drag';
      selector.classList.add('-draggingarea');
      totalWidth = selectorController.getBoundingClientRect().width;
      isMouseDown = true;
      const x = e.x - selectorController.getBoundingClientRect().x;
      startX = (x / totalWidth) * 100;
      initialStart = this.start;
      initialWidth = this.width;
      console.log(`totalWidth: ${totalWidth}, initialStart: ${initialStart}, this.width: ${this.width}`)
    });

    // resize selecting area

    // dragging behavior
    selectorController.addEventListener('mousemove', e => {
      if (isMouseDown) {
        let range;
        const x = (e.layerX / totalWidth) * 100;
        switch (interactionType) {
          case 'make': {
            // calculate selection range
            const selectedWidth = x - startX;
            let start, end;
            if (selectedWidth > 0) [start, end] = [startX, x];
            else [start, end] = [x, startX];
            range = [
              Math.floor(start / this.#unit),
              Math.ceil(end / this.#unit)
            ];
          }
          break;
          case 'drag': {
            let shift = (x - startX) / this.#unit;
            if (shift < -.5) shift = Math.floor(shift + .5);
            else if (.5 < shift) shift = Math.ceil(shift - .5);
            else shift = 0;
            range = [
              initialStart + shift,
              initialStart + shift + initialWidth
            ];
          }
          break;
          case 'resize': {
          }
          break;
        }
        this.#selection.range = range;
      }
    });
    selectorController.addEventListener('mouseup', () => {
      if (isMouseDown) {
        selector.classList.remove('-makingarea');
        selector.classList.remove('-draggingarea');
        isMouseDown = false;
        this.#update();
      }
    });
  }

  #update() {
    // selecting area
    this.#SELECTING_AREA.style.left = (this.start * this.#unit) + '%';
    this.#SELECTING_AREA.style.width = ((this.end - this.start) * this.#unit) + '%';
    // overview
    this.#SELECTOR_BARS.forEach((bar, index) => {
      if (this.#selection.start <= index && index < (this.#selection.end - 1)) bar.classList.add('-selected');
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

  get width() {
    return this.end - this.start;
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