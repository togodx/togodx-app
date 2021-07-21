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

    // reference
    this.#SELECTING_AREA = selector.querySelector(':scope > .inner > .selectingarea');
    const handlesArray = Array.from(this.#SELECTING_AREA.querySelectorAll(':scope > .handle'));
    const handles = {
      left: handlesArray.filter(handle => handle.dataset.direction === 'left'),
      right: handlesArray.filter(handle => handle.dataset.direction === 'right')
    }
    const selectorController = selector.querySelector(':scope > .inner > .controller');
    this.#SELECTOR_BARS = selector.querySelectorAll(':scope > .inner > .overview > .bar');

    // interaction
    let isMouseDown = false, startX, initialStart, initialWidth, totalWidth, interactionType;
    this.#unit = 100 / target.items.length;

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
    this.#SELECTING_AREA.addEventListener('mousemove', e => {
      if (isMouseDown) {
        const x = (e.layerX / totalWidth) * 100;
        const shift = Math.floor((x - startX) / this.#unit);
        console.log(`e.layerX: ${e.layerX}, x: ${x}, shift: ${shift}`)
        console.log('layerX:', e.layerX, ' offsetX:', e.offsetX, ' screenX:', e.screenX, ' left:', e.target.getBoundingClientRect().left)
        console.log(e)
        // console.log(e.target.getBoundingClientRect())
        // console.log(this.width)
        // console.log(startStart, x, shift)
        // switch (true) {
        //   case (startStart + shift) < 0:
        //     shift -= startStart + shift;
        //     break;
        //   case (startStart + shift + this.width) > target.items.length:
        //     shift -= startStart + shift + this.width;
        //     break;
        // }
        // console.log(startStart, x, shift)
        // this.#selection.range = [
        //   startStart + shift,
        //   startStart + shift + this.width
        // ];
        this.#selection.range = [
          initialStart + shift,
          initialStart + shift + initialWidth
        ];
        console.log(`this.start: ${this.start}, this.end: ${this.end}`)
      }
    });
    this.#SELECTING_AREA.addEventListener('mouseup', () => {
      if (isMouseDown) {
        selector.classList.remove('-draggingarea');
        isMouseDown = false;
        this.#update();
      }
    });

    // resize selecting area
  }


  // private methods

  #defineInteraction() {

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