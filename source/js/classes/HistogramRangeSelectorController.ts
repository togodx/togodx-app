import ConditionBuilder from './ConditionBuilder.ts';
import HistogramRangeSelectorView from './HistogramRangeSelectorView.ts';


type Range = [number, number];
interface Selection {
  start: number;
  end: number;
  range: Range;
}

export default class HistogramRangeSelectorController {
  #target: HistogramRangeSelectorView;
  #selection: Selection;
  #unit: number;
  #SELECTING_AREA: HTMLDivElement;
  #SELECTOR_BARS: HTMLDivElement[];

  constructor(target: HistogramRangeSelectorView, selector: HTMLDivElement) {
    // definition
    this.#target = target;
    this.#unit = 100 / target.items.length;
    this.#selection = {};
    this.#defineSelection();

    // reference
    this.#SELECTING_AREA = selector.querySelector(
      ':scope > .inner > .selectingarea'
    )!;
    this.#SELECTOR_BARS = Array.from(selector.querySelectorAll(
      ':scope > .inner > .overview > .bar'
    ));

    // interaction
    this.#defineInteraction(selector);
  }

  // private methods

  #defineSelection() {
    let selectionStart = 0,
      selectionEnd = 0;
    Object.defineProperties(this.#selection, {
      start: {
        get: () => {
          return selectionStart;
        },
        set: value => {
          if (selectionStart !== value) {
            selectionStart = value;
            this.#update();
          }
        },
      },
      end: {
        get: () => {
          return selectionEnd;
        },
        set: value => {
          if (selectionEnd !== value) {
            selectionEnd = value;
            this.#update();
          }
        },
      },
      range: {
        get: () => {
          return [selectionStart, selectionEnd];
        },
        set: ([start, end]) => {
          if (selectionStart !== start || selectionEnd !== end) {
            selectionStart = start;
            selectionEnd = end;
            this.#update();
          }
        },
      },
    });
  }

  #defineInteraction(selector: HTMLDivElement) {
    let isMouseDown = false,
      startX: number,
      initialStart: number,
      initialEnd: number,
      initialWidth: number,
      totalWidth: number,
      interactionType: string,
      direction: string;

    // references
    const selectorController: HTMLDivElement = selector.querySelector(
      ':scope > .inner > .controller'
    )!;
    const handles: HTMLDivElement[] = Array.from(
      this.#SELECTING_AREA.querySelectorAll(':scope > .handle')
    );
    // const handles = {
    //   left: handlesArray.filter(handle => handle.dataset.direction === 'start'),
    //   right: handlesArray.filter(handle => handle.dataset.direction === 'end')
    // };

    const init = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      totalWidth = selectorController.getBoundingClientRect().width;
      isMouseDown = true;
      const x = e.x - selectorController.getBoundingClientRect().x;
      startX = (x / totalWidth) * 100;
    };

    // make selecting area
    selectorController.addEventListener('mousedown', (e: MouseEvent) => {
      interactionType = 'make';
      selector.classList.add('-makingarea');
      init(e);
    });

    // drag selecting area
    this.#SELECTING_AREA.addEventListener('mousedown', (e: MouseEvent) => {
      interactionType = 'drag';
      selector.classList.add('-draggingarea');
      initialStart = this.start;
      initialWidth = this.width;
      init(e);
    });

    // resize selecting area
    handles.forEach(handle =>
      handle.addEventListener('mousedown', (e: MouseEvent) => {
        interactionType = 'resize';
        direction = (e.target as HTMLElement).dataset.direction!;
        selector.classList.add('-resizingarea');
        initialStart = this.start;
        initialEnd = this.end;
        init(e);
      })
    );

    // dragging behavior
    selectorController.addEventListener('mousemove', e => {
      if (isMouseDown) {
        let range: Range;
        const x = (e.offsetX / totalWidth) * 100;
        switch (interactionType) {
          case 'make':
            {
              // calculate selection range
              const selectedWidth = x - startX;
              let start, end;
              if (selectedWidth > 0) [start, end] = [startX, x];
              else [start, end] = [x, startX];
              range = [
                Math.floor(start / this.#unit),
                Math.ceil(end / this.#unit),
              ];
            }
            break;
          case 'drag':
            {
              let translation = (x - startX) / this.#unit;
              if (translation < -0.5)
                translation = Math.floor(translation + 0.5);
              else if (0.5 < translation)
                translation = Math.ceil(translation - 0.5);
              else translation = 0;
              translation -=
                initialStart + translation < 0 ? initialStart + translation : 0;
              translation -=
                initialStart + translation + initialWidth >
                this.#target.items.length
                  ? initialStart +
                    translation +
                    initialWidth -
                    this.#target.items.length
                  : 0;
              range = [
                initialStart + translation,
                initialStart + translation + initialWidth,
              ];
            }
            break;
          case 'resize':
            {
              let [start, end] = [initialStart, initialEnd];
              switch (direction) {
                case 'start':
                  start += Math.floor((x - startX) / this.#unit + 0.5);
                  if (end < start) [start, end] = [end, start];
                  break;
                case 'end':
                  end += Math.ceil((x - startX) / this.#unit - 0.5);
                  if (end < start) [start, end] = [end, start];
                  break;
              }
              if (start < 0) start = 0;
              if (this.#target.items.length < end)
                end = this.#target.items.length;
              range = [start, end];
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
        selector.classList.remove('-resizingarea');
        isMouseDown = false;
        this.#update();
      }
    });
  }

  #update() {
    // selecting area
    this.#SELECTING_AREA.style.left = this.start * this.#unit + '%';
    this.#SELECTING_AREA.style.width =
      (this.end - this.start) * this.#unit + '%';
    // overview
    this.#SELECTOR_BARS.forEach((bar: HTMLDivElement, index: number) => {
      if (this.start <= index && index < this.end)
        bar.classList.add('-selected');
      else bar.classList.remove('-selected');
    });
    this.#target.update();
    // set condition
    ConditionBuilder.setFilter(
      this.#target.attributeId,
      this.selectedItems.map(item => item.node),
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
    if (this.width !== 0) {
      items.push(
        ...this.#target.items.filter((item_, index: number) => {
          if (this.start <= index && index < this.end) return true;
          else return false;
        })
      );
    }
    return items;
  }
}
