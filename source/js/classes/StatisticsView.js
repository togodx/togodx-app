import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from './Records';
import * as event from '../events';

export default class StatisticsView {

  #index;
  #attributeId;
  #tableData;
  #referenceValues;
  #BARS;
  #ROOT;
  #ROOT_NODE;

  constructor(statisticsRootNode, elm, tableData, index, condition) {

    this.#index = index;
    this.#attributeId = condition.attributeId;
    this.#tableData = tableData;
    this.#ROOT_NODE = statisticsRootNode;
    this.#ROOT = elm;

    elm.classList.add('statistics-view');
    elm.dataset.catexxxgoryId = condition.catexxxgoryId;

    // make HTML
    elm.innerHTML = `
    <div class="statistics">
      <div class="bars"></div>
    </div>
    <div class="loading-view -shown"></div>
    `;

    // display order of bar chart
    if (condition.parentCategoryId) {
      this.#referenceValues = Records.getValuesWithParentCategoryId(this.#attributeId, condition.parentCategoryId);
    } else {
      this.#referenceValues = Records.getAttribute(this.#attributeId).values;
    }

    // references
    const container = elm.querySelector(':scope > .statistics');
    this.#BARS = container.querySelector(':scope > .bars');

    // event listener
    DefaultEventEmitter.addEventListener(event.addNextRows, this.#draw.bind(this));
    DefaultEventEmitter.addEventListener(event.changeStatisticsViewMode, this.#draw.bind(this));
    DefaultEventEmitter.addEventListener(event.failedFetchTableDataIds, this.#failedFetchTableDataIds.bind(this));
  }

  destroy() {
    DefaultEventEmitter.removeEventListener(event.addNextRows, this.#draw.bind(this));
    DefaultEventEmitter.removeEventListener(event.changeStatisticsViewMode, this.#draw.bind(this));
    DefaultEventEmitter.removeEventListener(event.failedFetchTableDataIds, this.#failedFetchTableDataIds.bind(this));
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
          .map(datum => datum.attributes[this.#index])
          .map(attribute => attribute.items)
          .flat(),
          'entry'
      )
    );

    const hitVlues = [];
    this.#referenceValues.forEach(({categoryId, label, count}) => {
      const filtered = attributes.filter(attribute => attribute.node === categoryId);
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
        <div class="hitbar _catexxxgory-background-color-strong">
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
      const hitCountLabel = hitbar.querySelector(':scope > .value');
      let hitbarHeight;
      if (isStretch) {
        hitbarHeight = hitCount / count;
        hitCountLabel.textContent = `${Math.round(hitCount / count * 100)}%`;
      } else {
        hitbarHeight = hitCount / countMax;
        hitCountLabel.textContent = hitCount.toLocaleString();
      }
      hitbar.style.height = `${hitbarHeight * 100}%`;
      if (hitbarHeight < .5) {
        hitCountLabel.classList.add('-below');
      } else {
        hitCountLabel.classList.remove('-below');
      }
      return bar;
    }, undefined);

    if (e?.detail?.done) {
      this.#ROOT.classList.add('-completed');
      this.#ROOT.querySelector(':scope > .loading-view').classList.remove('-shown');
    }

  }

  #failedFetchTableDataIds() {
    this.#ROOT.querySelector(':scope > .loading-view').classList.remove('-shown');
  }

}