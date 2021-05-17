import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

const PADDING = 10;
const NUM_OF_GRID = 4;

export default class HistogramRangeSelectorView {

  #items;
  #property;
  #OVERVIEW_CONTAINER;
  #GRIDS;

  constructor(elm, subject, property, items, sparqlist, overview) {
    console.log(elm, subject, property, items, sparqlist)

    this._subject = subject;
    this.#property = property;
    this._sparqlist = sparqlist;
    this.#OVERVIEW_CONTAINER = overview;
    this.#items = items.map(item => Object.assign({}, item));

    // make container
    elm.innerHTML = `
    <div class="histogram-range-selector-view">
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

    // make graph
    const graph = elm.querySelector('.graph');
    const width = 100 / this.#items.length;
    graph.innerHTML = this.#items.map((item, index) => `<div class="bar" data-category-id="${item.categoryId}" data-count="${item.count}" style="width: ${width}%;">
      <div class="actual" style="background-color: ${App.getHslColor(subject.hue)};">
        <div class="color" style="background-color: hsla(${360 * index / this.#items.length}, 70%, 50%, .075);"></div>
      </div>
      <p class="label">${item.label}</p>
    </div>`).join('');

    // reference
    const histogram = elm.querySelector(':scope > .histogram-range-selector-view > .histogram');
    histogram.querySelectorAll(':scope > .graph > .bar').forEach((item, index) => {
      this.#items[index].elm = item;
    })
    this.#GRIDS = histogram.querySelectorAll(':scope > .gridcontainer > .grid');
    
    this.#update();

    // event
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update());
    graph.querySelectorAll(':scope > .bar')
  }


  // private methods

  #update() {

    const max = Math.max(...Array.from(this.#items).map(item => item.count));
    const isLog10 = App.viewModes.log10;
    const processedMax = isLog10 ? Math.log10(max) : max;

    // grid
    const digits = String(Math.ceil(max)).length;
    const unit = Number(String((Number(String(max).charAt(0)) + 1)).padEnd(digits, '0')) / NUM_OF_GRID;
    this.#GRIDS.forEach((grid, index) => {
      const scale = unit * index;
      grid.style.bottom = `${(isLog10 ? Math.log10(scale) : scale) / processedMax * 100}%`;
      grid.querySelector(':scope > .label').textContent = (scale).toLocaleString();
    });

    // graph
    this.#items.forEach(item => {
      item.elm.querySelector(':scope > .actual').style.height = (isLog10 ? Math.log10(item.count) : item.count) / processedMax * 100 + '%';
    });
  }

  #indicateValue() {

  }

}