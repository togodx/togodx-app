import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

const PADDING = 10;
const NUM_OF_GRID = 4;

export default class HistogramRangeSelectorView {

  #items;
  #property;
  #selectedBarsStart;
  #selectedBarsEnd;
  #OVERVIEW_CONTAINER;
  #ROOT;
  #SELECTOR_BARS;
  #GRIDS;

  constructor(elm, subject, property, items, sparqlist, overview) {
    console.log(elm, subject, property, items, sparqlist)

    this._subject = subject;
    this._sparqlist = sparqlist;
    this.#property = property;
    this.#OVERVIEW_CONTAINER = overview;
    this.#items = items.map(item => Object.assign({}, item));

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
      <div class="controller">
        <div class="selector">
          <div class="slider -min"></div>
          <div class="slider -max"></div>
        </div>
        <!--
        <div class="form">
          <input type="number" data-range="min">
          ~
          <input type="number" data-range="max">
        </div>
        -->
      </div>`;
    this.#ROOT = elm.querySelector(':scope > .histogram-range-selector-view');
    const histogram = this.#ROOT.querySelector(':scope > .histogram');
    const selector = this.#ROOT.querySelector(':scope > .selector');

    // make graph
    const width = 100 / this.#items.length;
    selector.querySelector(':scope > .overview').innerHTML = this.#items.map(item => `<div class="bar" data-category-id="${item.categoryId}" data-count="${item.count}" style="width: ${width}%; background-color: ${App.getHslColor(subject.hue)};"></div>`).join('');
    const graph = histogram.querySelector(':scope > .graph');
    graph.innerHTML = this.#items.map((item, index) => `<div class="bar" data-category-id="${item.categoryId}" data-count="${item.count}" style="width: ${width}%;">
      <div class="actual" style="background-color: ${App.getHslColor(subject.hue)};">
        <div class="color" style="background-color: hsla(${360 * index / this.#items.length}, 70%, 50%, .075);"></div>
      </div>
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
        const selectedWidth = e.layerX - startX;
        if (selectedWidth > 0) {
          this.#selectedBarsStart = Math.floor(startX / unit);
          this.#selectedBarsEnd = Math.floor(e.layerX / unit)
        } else {
          this.#selectedBarsStart = Math.floor(e.layerX / unit);
          this.#selectedBarsEnd = Math.floor(startX / unit)
        }
        // TODO:
      }
    });
    selectorController.addEventListener('mouseup', e => {
      if (isMouseDown) {
        isMouseDown = false;
      }
    });
    // graph.querySelectorAll(':scope > .bar')
  }

  #update() {

    const max = Math.max(...Array.from(this.#items).map(item => item.count));
    const isLog10 = App.viewModes.log10;
    const processedMax = isLog10 ? Math.log10(max) : max;

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
      const height = (isLog10 ? Math.log10(item.count) : item.count) / processedMax * 100;
      item.elm.querySelector(':scope > .actual').style.height = `${height}%`;
      this.#SELECTOR_BARS.find(bar => bar.dataset.categoryId === item.categoryId).style.height = `${height}%`;
    });
  }

  #indicateValue() {

  }

}