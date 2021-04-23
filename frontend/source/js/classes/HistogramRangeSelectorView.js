import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";

export default class HistogramRangeSelectorView {

  constructor(elm, subject, property, items, sparqlist) {
    // console.log(elm, subject, property, items, sparqlist)

    this._subject = subject;
    this._property = property;
    this._sparqlist = sparqlist;
    this._items = items.map(item => Object.assign({}, item));

    // make container
    elm.innerHTML = `
    <div class="histogram-range-selector-view">
      <div class="histogram">
        <div class="grid"></div>
        <div class="graph"></div>
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
    const width = 100 / this._items.length;
    elm.querySelector('.graph').innerHTML = this._items.map((item, index) => `<div class="bar" style="width: ${width}%; background-color: ${App.getHslColor(subject.hue)};" data-count="${item.count}">
      <div class="color" style="background-color: hsla(${360 * index / this._items.length}, 70%, 50%, .075);"></div>
    </div>`).join('');
    elm.querySelectorAll('.graph > .bar').forEach((item, index) => {
      this._items[index].elm = item;
    })
    this._update();

    // event
    DefaultEventEmitter.addEventListener('changeViewModes', e => this._update());
  }

  _update() {
    const isLog10 = App.viewModes.log10;
    let max = Math.max(...Array.from(this._items).map(item => item.count));
    max = isLog10 ? Math.log10(max) : max;
    this._items.forEach(item => {
      item.elm.style.height = (isLog10 ? Math.log10(item.count) : item.count) / max * 100 + '%';
    });
  }

}