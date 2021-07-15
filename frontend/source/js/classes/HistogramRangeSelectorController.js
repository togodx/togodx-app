import ConditionBuilder from "./ConditionBuilder";

export default class HistogramRangeSelectorController {

  #target;
  #selection;

  constructor(target, selector) {

    // definition
    this.#target = target;
    let selectionStart, selectionEnd;
    this.#selection = {};
    Object.defineProperties(this.#selection, {
      start: {
        get() {
          return selectionStart;
        },
        set(value) {
          console.log(value)
          selectionStart = value;
        }
      },
      end: {
        get() {
          return selectionEnd;
        },
        set(value) {
          console.log(value)
          selectionEnd = value;
        }
      }
    });


    // set up

    const selectingArea = selector.querySelector(':scope > .inner > .selectingarea');
    const selectorController = selector.querySelector(':scope > .inner > .controller');

    let isMouseDown = false, startX, width, unit;
    selectorController.addEventListener('mousedown', e => {
      width = e.target.getBoundingClientRect().width;
      unit = width / target.items.length;
      isMouseDown = true;
      startX = e.layerX;
    });
    selectorController.addEventListener('mousemove', e => {
      if (isMouseDown) {
        // selection range
        const selectedWidth = e.layerX - startX;
        if (selectedWidth > 0) {
          this.#selection.start = Math.floor(startX / unit);
          this.#selection.end = Math.floor(e.layerX / unit)
        } else {
          this.#selection.start = Math.floor(e.layerX / unit);
          this.#selection.end = Math.floor(startX / unit)
        }
        // select overview by range
        selector.querySelectorAll(':scope > .inner > .overview > .bar').forEach((bar, index) => {
          if (this.#selection.start <= index && index <= this.#selection.end) {
            bar.classList.add('-selected');
          } else {
            bar.classList.remove('-selected');
          }
        });
        target.update();
        // set condition
        ConditionBuilder.setPropertyValues(
          target.propertyId,
          this.selectedItems.map(item => item.categoryId),
          false
        );
      }
    });
    selectorController.addEventListener('mouseup', e => {
      if (isMouseDown) {
        isMouseDown = false;
        ConditionBuilder.setPropertyValues(
          target.propertyId,
          this.selectedItems.map(item => item.categoryId)
        );
      }
    });
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