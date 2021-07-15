import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import HistogramRangeSelectorController from "./HistogramRangeSelectorController";
import * as event from '../events';
import * as util from '../functions/util';

const NUM_OF_GRID = 4;

export default class HistogramRangeSelectorView {

  #items;
  #property;
  #selectorController;
  #OVERVIEW_CONTAINER;
  #ROOT;
  #SELECTOR_BARS;
  #GRIDS;

  constructor(elm, subject, property, items, sparqlist, overviewContainer) {
    // console.log(elm, subject, property, items, sparqlist)

    this._sparqlist = sparqlist;
    this.#property = property;
    this.#OVERVIEW_CONTAINER = overviewContainer;
    this.#items = items.map(item => Object.assign({}, item));

    // make container
    elm.innerHTML = `
    <div class="histogram-range-selector-view" data-subject-id="${subject.subjectId}">
      <div class="selector">
        <div class="inner">
          <div class="overview"></div>
          <div class="selectingarea"></div>
          <div class="controller"></div>
        </div>
      </div>
      <div class="histogram">
        <div class="graph"></div>
        <div class="gridcontainer">
          ${'<div class="grid"><p class="label"></p></div>'.repeat(NUM_OF_GRID)}
        </div>
        <svg class="additionalline"></svg>
      </div>`;
    this.#ROOT = elm.querySelector(':scope > .histogram-range-selector-view');
    const histogram = this.#ROOT.querySelector(':scope > .histogram');
    const selector = this.#ROOT.querySelector(':scope > .selector > .inner');
    const overview = selector.querySelector(':scope > .overview');

    // make graph
    const max = Math.max(...this.#items.map(item => item.count));
    const width = 100 / this.#items.length;
    overview.innerHTML = this.#items.map(item => `<div
      class="bar _subject-background-color"
      data-category-id="${item.categoryId}"
      data-subject-id="${subject.subjectId}"
      data-count="${item.count}"
      style="width: ${width}%; height: ${(item.count / max) * 100}%;"></div>`).join('');
    const graph = histogram.querySelector(':scope > .graph');
    graph.innerHTML = this.#items.map((item, index) => `<div class="bar" data-category-id="${item.categoryId}" data-count="${item.count}">
      <div class="actual" style="background-color: rgb(${util.colorTintByHue(subject.color, 360 * index / this.#items.length).coords.map(cood => cood * 256).join(',')});"></div>
      <p class="label">${item.label}</p>
    </div>`).join('');

    // reference
    histogram.querySelectorAll(':scope > .graph > .bar').forEach((item, index) => this.#items[index].elm = item);
    this.#GRIDS = histogram.querySelectorAll(':scope > .gridcontainer > .grid');
    this.#SELECTOR_BARS = Array.from(overview.querySelectorAll(':scope > .bar'));

    // event
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.update());
    
    // this.#setupRangeSelector();
    this.#selectorController = new HistogramRangeSelectorController(this, this.#ROOT.querySelector(':scope > .selector'));
    this.update();
  }


  // private methods

  #indicateValue() {

  }


  // public methods

  update() {

    const selectedItems = this.#selectorController.start ? this.#selectorController.selectedItems : this.#items;

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


  // public accessor

  get items() {
    return this.#items;
  }

  get propertyId() {
    return this.#property.propertyId;
  }

}