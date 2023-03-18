import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import * as event from '../events';
import _ from 'lodash';

export default class StatisticsView {
  #index;
  #attributeId;
  #tableData;
  #referenceFilters;
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
    elm.dataset.categoryId = condition.categoryId;

    // make HTML
    elm.innerHTML = `
    <div class="statistics">
      <div class="bars"></div>
    </div>
    <div class="loading-view -shown"></div>
    `;

    // display order of bar chart
    if (condition.parentNode) {
      this.#referenceFilters = Records.getFiltersWithParentNode(
        this.#attributeId,
        condition.parentNode
      );
    } else {
      this.#referenceFilters = Records.getAttribute(this.#attributeId).filters;
    }

    // references
    const container = elm.querySelector(':scope > .statistics');
    this.#BARS = container.querySelector(':scope > .bars');

    // event listener
    DefaultEventEmitter.addEventListener(
      event.addNextRows,
      this.#draw.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      event.changeStatisticsViewMode,
      this.#draw.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      event.failedFetchTableDataIds,
      this.#failedFetchTableDataIds.bind(this)
    );
  }

  destroy() {
    DefaultEventEmitter.removeEventListener(
      event.addNextRows,
      this.#draw.bind(this)
    );
    DefaultEventEmitter.removeEventListener(
      event.changeStatisticsViewMode,
      this.#draw.bind(this)
    );
    DefaultEventEmitter.removeEventListener(
      event.failedFetchTableDataIds,
      this.#failedFetchTableDataIds.bind(this)
    );
  }

  /**
   * @param {TableData} detail.tableData
   * @param {Array} detail.rows
   * @param {Boolean} detail.done
   */
  #draw(e) {
    const flattenedAttributes = this.#tableData.data
      .map(datum => datum.attributes[this.#index])
      .map(attribute => attribute.items)
      .flat();
    const uniquedAttributes = _.uniqWith(flattenedAttributes, (a, b) => {
      return a.entry === b.entry && a.node === b.node;
    });
    const hitVlues = [];
    this.#referenceFilters.forEach(({node, label, count}) => {
      const filtered = uniquedAttributes.filter(
        attribute => attribute.node === node
      );
      if (filtered.length === 0) return;
      hitVlues.push({
        node,
        label,
        count,
        hitCount: filtered.length,
      });
    });

    // max
    let countMax;
    const isOnlyHitCount = this.#ROOT_NODE.classList.contains('-onlyhitcount');
    const isStretch =
      !isOnlyHitCount && this.#ROOT_NODE.classList.contains('-stretch');
    if (isOnlyHitCount) {
      countMax = Math.max(...hitVlues.map(filter => filter.hitCount));
    } else {
      countMax = Math.max(...hitVlues.map(filter => filter.count));
    }

    hitVlues.reduce((lastBar, {node, label, count, hitCount}) => {
      let bar = this.#BARS.querySelector(`:scope > .bar[data-node="${node}"]`);
      if (bar === null) {
        // add bar
        bar = document.createElement('div');
        bar.classList.add('bar');
        bar.dataset.node = node;
        bar.setAttribute('title', label);
        bar.innerHTML = `
        <div class="wholebar"></div>
        <div class="hitbar _category-background-color">
          <div class="filter"></div>
        </div>
        <div class="label">${label}</div>`;
        if (lastBar) {
          lastBar.after(bar);
        } else {
          this.#BARS.append(bar);
        }
      }
      // styling
      bar.querySelector(':scope > .wholebar').style.height = `${
        (count / countMax) * 100
      }%`;
      const hitbar = bar.querySelector(':scope > .hitbar');
      const hitCountLabel = hitbar.querySelector(':scope > .filter');
      let hitbarHeight;
      if (isStretch) {
        hitbarHeight = hitCount / count;
        hitCountLabel.textContent = `${Math.round((hitCount / count) * 100)}%`;
      } else {
        hitbarHeight = hitCount / countMax;
        hitCountLabel.textContent = hitCount.toLocaleString();
      }
      hitbar.style.height = `${hitbarHeight * 100}%`;
      if (hitbarHeight < 0.5) {
        hitCountLabel.classList.add('-below');
      } else {
        hitCountLabel.classList.remove('-below');
      }
      return bar;
    }, undefined);

    if (e?.detail?.dxCondition.isPropertiesLoaded) {
      this.#ROOT.classList.add('-completed');
      this.#ROOT
        .querySelector(':scope > .loading-view')
        .classList.remove('-shown');
    }
  }

  #failedFetchTableDataIds() {
    this.#ROOT
      .querySelector(':scope > .loading-view')
      .classList.remove('-shown');
  }
}
