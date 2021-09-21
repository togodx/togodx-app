import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from './Records';
import * as event from '../events';

export default class StatisticsView {

  #propertyId;
  #tableData;
  #BARS;
  #ROOT;
  #ROOT_NODE;

  constructor(statisticsRootNode, elm, tableData, {subject, property}) {

    this.#propertyId = property.propertyId;
    this.#tableData = tableData;
    this.#ROOT_NODE = statisticsRootNode;
    this.#ROOT = elm;

    elm.classList.add('statistics-view');
    elm.dataset.subjectId = subject.subjectId;

    // make HTML
    elm.innerHTML = `
    <div class="statistics">
      <div class="bars"></div>
    </div>
    <div class="loading-view -shown"></div>
    `;

    // references
    const container = elm.querySelector(':scope > .statistics');
    this.#BARS = container.querySelector(':scope > .bars');

    // event listener
    DefaultEventEmitter.addEventListener(event.addNextRows, this.#draw.bind(this));
    DefaultEventEmitter.addEventListener(event.changeToOnlyHitCountInStatisticsView, this.#draw.bind(this));
    DefaultEventEmitter.addEventListener(event.changeToStretchInStatisticsView, this.#draw.bind(this));
  }

  destroy() {
    DefaultEventEmitter.removeEventListener(event.addNextRows, this.#draw.bind(this));
    DefaultEventEmitter.removeEventListener(event.changeToOnlyHitCountInStatisticsView, this.#draw.bind(this));
    DefaultEventEmitter.removeEventListener(event.changeToStretchInStatisticsView, this.#draw.bind(this));
  }

  /**
   * @param {TableData} detail.tableData
   * @param {Array} detail.rows
   * @param {Boolean} detail.done
   */
  #draw(e) {

    const attributes = (
      _.uniqBy(
        this.#tableData.data
        .map(datum => datum.properties.find(property => property.propertyId === this.#propertyId))
        .filter(property => property !== undefined)
        .map(property => property.attributes)
        .flat(),
        'id'
      ).map(property => property.attribute)
    );

    const hitVlues = [];
    Records.getProperty(this.#propertyId).values.forEach(({categoryId, label, count}) => {
      const filtered = attributes.filter(attribute => attribute.categoryId === categoryId);
      if (filtered.length === 0) return;
      hitVlues.push({
        categoryId, label, count,
        hitCount: filtered.length
      })
    });

    // max
    let countMax;
    const isOnlyHitCount = this.#ROOT_NODE.classList.contains('-onlyhitcount');
    const isStretch = !isOnlyHitCount && this.#ROOT_NODE.classList.contains('-stretch');
    if (isOnlyHitCount) {
      countMax = Math.max(...hitVlues.map(value => value.hitCount));
    } else {
      countMax = Math.max(...hitVlues.map(value => value.count));
    }

    hitVlues.reduce((lastBar, {categoryId, label, count, hitCount}) => {
      let bar = this.#BARS.querySelector(`:scope > .bar[data-category-id="${categoryId}"]`);
      if (bar === null) {
        // add bar
        bar = document.createElement('div');
        bar.classList.add('bar');
        bar.dataset.categoryId = categoryId;
        bar.innerHTML = `
        <div class="wholebar"></div>
        <div class="hitbar _subject-background-color-strong">
          <div class="value"></div>
        </div>
        <div class="label">${label}</div>`;
        if (lastBar) {
          lastBar.after(bar);
        } else {
          this.#BARS.append(bar);
        }
      }
      // styling
      bar.querySelector(':scope > .wholebar').style.height = `${count / countMax * 100}%`;
      const hitbar = bar.querySelector(':scope > .hitbar');
      if (isStretch)  hitbar.style.height = `${hitCount / count * 100}%`;
      else            hitbar.style.height = `${hitCount / countMax * 100}%`;
      const hitCountLabel = hitbar.querySelector(':scope > .value');
      hitCountLabel.textContent = hitCount.toLocaleString();
      if (hitCount / countMax < .5) {
        hitCountLabel.classList.add('-below');
      } else {
        hitCountLabel.classList.remove('-below');
      }
      return bar;
    }, undefined);

    if (e?.detail.done) {
      this.#ROOT.classList.add('-completed');
      this.#ROOT.querySelector(':scope > .loading-view').classList.remove('-shown');
    }

  }

}