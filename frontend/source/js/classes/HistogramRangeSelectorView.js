import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import * as event from '../events';

const PADDING = 10;

export default class HistogramRangeSelectorView {

  #items;
  #property;
  #OVERVIEW_CONTAINER;

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
        <div class="grid"></div>
        <div class="graph"></div>
        <svg class="additionalline"></svg>
      </div>
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
    elm.querySelectorAll('.graph > .bar').forEach((item, index) => {
      this.#items[index].elm = item;
    })
    this.#update();

    // event
    DefaultEventEmitter.addEventListener(event.changeViewModes, e => this.#update());
    graph.querySelectorAll(':scope > .bar')
  }

  // private methods

  #update() {
    const isLog10 = App.viewModes.log10;
    let max = Math.max(...Array.from(this.#items).map(item => item.count));
    max = isLog10 ? Math.log10(max) : max;
    this.#items.forEach(item => {
      item.elm.querySelector(':scope > .actual').style.height = (isLog10 ? Math.log10(item.count) : item.count) / max * 100 + '%';
    });
  }

  #indicateValue() {

  }

}