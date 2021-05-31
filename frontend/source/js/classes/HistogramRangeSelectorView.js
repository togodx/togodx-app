import App from "./App";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';
import * as util from '../functions/util';

const NUM_OF_GRID = 4;

export default class HistogramRangeSelectorView {

  #items;
  #subject;
  #property;
  #selectedBarsStart;
  #selectedBarsEnd;
  #OVERVIEW_CONTAINER;
  #ROOT;
  #SELECTOR_BARS;
  #GRIDS;

  constructor(elm, subject, property, items, sparqlist, overview) {
    // console.log(elm, subject, property, items, sparqlist)

    this.#subject = subject;
    this._sparqlist = sparqlist;
    this.#property = property;
    this.#OVERVIEW_CONTAINER = overview;
    this.#items = items.map(item => Object.assign({}, item));
    this.#selectedBarsStart = undefined;
    this.#selectedBarsEnd = undefined;

    // make container
    elm.innerHTML = `
    <div class="histogram-range-selector-view">
      <div class="selector">
        <div class="overview"></div>
        <div class="controller"></div>
      </div>
      <div class="histogram">
        <div class="graph"></div>
        <div class="gridcontainer">
          ${'<div class="grid"><p class="label"></p></div>'.repeat(NUM_OF_GRID)}
        </div>
        <svg class="additionalline"></svg>
      </div>
      <!--
      <div class="controller">
        <div class="selector">
          <div class="slider -min"></div>
          <div class="slider -max"></div>
        </div>
        <div class="form">
          <input type="number" data-range="min">
          ~
          <input type="number" data-range="max">
        </div>
      </div>
      -->`;
    this.#ROOT = elm.querySelector(':scope > .histogram-range-selector-view');
    const histogram = this.#ROOT.querySelector(':scope > .histogram');
    const selector = this.#ROOT.querySelector(':scope > .selector');

    // make graph
    const max = Math.max(...this.#items.map(item => item.count));
    const width = 100 / this.#items.length;
    selector.querySelector(':scope > .overview').innerHTML = this.#items.map(item => `<div class="bar" data-category-id="${item.categoryId}" data-count="${item.count}" style="width: ${width}%; height: ${(item.count / max) * 100}%; background-color: ${subject.colorCSSValue};"></div>`).join('');
    const graph = histogram.querySelector(':scope > .graph');
    graph.innerHTML = this.#items.map((item, index) => `<div class="bar" data-category-id="${item.categoryId}" data-count="${item.count}">
      <div class="actual" style="background-color: rgb(${util.colorTintByHue(subject.color, 360 * index / this.#items.length).coords.map(cood => cood * 256).join(',')});"></div>
      <p class="label">${item.label}</p>
    </div>`).join('');

    // reference
    histogram.querySelectorAll(':scope > .graph > .bar').forEach((item, index) => this.#items[index].elm = item);
    this.#GRIDS = histogram.querySelectorAll(':scope > .gridcontainer > .grid');
    this.#SELECTOR_BARS = Array.from(selector.querySelectorAll(':scope > .overview > .bar'));

    // event
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update());
    
    this.#setupRangeSelector();
    this.#update();
  }


  // private methods

  #setupRangeSelector() {
    const selectorController = this.#ROOT.querySelector(':scope > .selector > .controller')

    let isMouseDown = false, startX, width, unit;
    selectorController.addEventListener('mousedown', e => {
      width = e.target.getBoundingClientRect().width;
      unit = width / this.#items.length;
      isMouseDown = true;
      startX = e.layerX;
    });
    selectorController.addEventListener('mousemove', e => {
      if (isMouseDown) {
        // selection range
        const selectedWidth = e.layerX - startX;
        if (selectedWidth > 0) {
          this.#selectedBarsStart = Math.floor(startX / unit);
          this.#selectedBarsEnd = Math.floor(e.layerX / unit)
        } else {
          this.#selectedBarsStart = Math.floor(e.layerX / unit);
          this.#selectedBarsEnd = Math.floor(startX / unit)
        }
        // select overview by range
        this.#ROOT.querySelectorAll(':scope > .selector > .overview > .bar').forEach((bar, index) => {
          if (this.#selectedBarsStart <= index && index <= this.#selectedBarsEnd) {
            bar.classList.add('-selected');
          } else {
            bar.classList.remove('-selected');
          }
        });
        this.#update();
        // set condition
        const selectedItems = this.#selectedItems;
        ConditionBuilder.setPropertyValues({
          subject: this.#subject,
          property: this.#property,
          values: selectedItems.map(item => {
            return {
              categoryId: item.categoryId,
              label: item.label,
              ancestors: []
            }
          })
        });
      }
    });
    selectorController.addEventListener('mouseup', e => {
      if (isMouseDown) {
        isMouseDown = false;
      }
    });
  }

  #update() {

    const selectedItems = this.#selectedBarsStart ? this.#selectedItems : this.#items;

    const max = Math.max(...selectedItems.map(item => item.count));
    const isLog10 = App.viewModes.log10;
    const processedMax = isLog10 ? Math.log10(max) : max;
    const width = 100 / selectedItems.length;

    // grid
    const digits = String(Math.ceil(max)).length;
    const unit = Number(String(max).charAt(0).padEnd(digits, '0')) / NUM_OF_GRID;
    this.#GRIDS.forEach((grid, index) => {
      const scale = unit * index;
      grid.style.bottom = `${(isLog10 ? Math.log10(scale) : scale) / processedMax * 100}%`;
      grid.querySelector(':scope > .label').textContent = (scale).toLocaleString();
    });

    // graph
    this.#items.forEach(item => {
      if (selectedItems.indexOf(item) === -1) {
        item.elm.classList.add('-filtered');
      } else {
        item.elm.classList.remove('-filtered');
        const height = (isLog10 ? Math.log10(item.count) : item.count) / processedMax * 100;
        item.elm.style.width = `${width}%`;
        item.elm.querySelector(':scope > .actual').style.height = `${height}%`;
        }
    });
  }

  #indicateValue() {

  }

  // private accessor
  get #selectedItems() {
    let items;
    if (this.#selectedBarsStart) {
      items = this.#items.filter((item_, index) => {
        if (this.#selectedBarsStart <= index && index <= this.#selectedBarsEnd) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      items = [];
    }
    return items;
  }

}