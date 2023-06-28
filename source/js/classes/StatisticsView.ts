import { BreakdownWithParentNode, DataFrameAttributeItem, TableRow } from './../interfaces.ts';
import DefaultEventEmitter from './DefaultEventEmitter.ts';
import Records from './Records.ts';
import ConditionResultsController from './ConditionResultsController.ts';
import ConditionFilterUtility from './ConditionFilterUtility.ts';
import ConditionAnnotationUtility from './ConditionAnnotationUtility.ts';
import * as events from '../events.js';
import _ from 'lodash';


type HitValue = {
  node: string;
  label: string;
  count: number;
  hitCount: number;
}
export default class StatisticsView {
  #index;
  #attributeId;
  #conditionResults;
  #referenceFilters;
  #BARS: HTMLDivElement;
  #ROOT: HTMLDivElement;
  #ROOT_NODE: HTMLTableRowElement;

  constructor(
    statisticsRootNode: HTMLTableRowElement,
    elm: HTMLDivElement,
    conditionResults: ConditionResultsController,
    index: number,
    condition: ConditionFilterUtility | ConditionAnnotationUtility
  ) {
    this.#index = index;
    this.#attributeId = condition.attributeId;
    this.#conditionResults = conditionResults;
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
    if (condition instanceof ConditionAnnotationUtility && condition.parentNode) {
      Records.fetchChildNodes(this.#attributeId, condition.parentNode).then(
        filters => {
          this.#referenceFilters = filters as BreakdownWithParentNode[];
          this.#draw();
        }
      );
    } else {
      this.#referenceFilters = Records.getAttribute(this.#attributeId).nodes;
    }

    // references
    const container = elm.querySelector(':scope > .statistics') as HTMLDivElement;
    this.#BARS = container.querySelector(':scope > .bars') as HTMLDivElement;

    // event listener
    DefaultEventEmitter.addEventListener(
      events.addNextRows,
      <EventListener>this.#draw.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      events.changeStatisticsViewMode,
      <EventListener>this.#draw.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      events.failedFetchConditionResultsIDs,
      this.#failedFetchConditionResultsIDs.bind(this)
    );
  }

  destroy() {
    DefaultEventEmitter.removeEventListener(
      events.addNextRows,
      <EventListener>this.#draw.bind(this)
    );
    DefaultEventEmitter.removeEventListener(
      events.changeStatisticsViewMode,
      <EventListener>this.#draw.bind(this)
    );
    DefaultEventEmitter.removeEventListener(
      events.failedFetchConditionResultsIDs,
      this.#failedFetchConditionResultsIDs.bind(this)
    );
  }

  /**
   * @param {ConditionResults} detail.conditionResults
   * @param {Array} detail.rows
   * @param {Boolean} detail.done
   */
  #draw(e?: CustomEvent<TableRow>) {
    const flattenedAttributes: DataFrameAttributeItem[] = this.#conditionResults.data
      .map(datum => datum.attributes[this.#index])
      .map(attribute => attribute.items)
      .flat();
    const uniquedAttributes: DataFrameAttributeItem[] = _.uniqWith(flattenedAttributes, (a, b) => {
      return a.entry === b.entry && a.node === b.node;
    });
    const hitVlues: HitValue[] = [];
    this.#referenceFilters?.forEach(({node, label, count}) => {
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
    console.log(hitVlues)

    // max
    let countMax: number;
    const isOnlyHitCount = this.#ROOT_NODE.classList.contains('-onlyhitcount');
    const isStretch =
      !isOnlyHitCount && this.#ROOT_NODE.classList.contains('-stretch');
    if (isOnlyHitCount) {
      countMax = Math.max(...hitVlues.map(filter => filter.hitCount));
    } else {
      countMax = Math.max(...hitVlues.map(filter => filter.count));
    }

    hitVlues.reduce((lastBar: HTMLDivElement | null, hitValue: HitValue) => {
      const {node, label, count, hitCount} = hitValue;
      let bar = this.#BARS.querySelector<HTMLDivElement>(`:scope > .bar[data-node="${node}"]`);
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
      (bar.querySelector(':scope > .wholebar') as HTMLDivElement).style.height = `${
        (count / countMax) * 100
      }%`;
      const hitbar = bar.querySelector(':scope > .hitbar') as HTMLDivElement;
      const hitCountLabel = hitbar.querySelector(':scope > .filter') as HTMLDivElement;
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
    }, null);

    if (e?.detail?.dxCondition.isPropertiesLoaded) {
      this.#ROOT.classList.add('-completed');
      (this.#ROOT
        .querySelector(':scope > .loading-view') as HTMLDivElement)
        .classList.remove('-shown');
    }
  }

  #failedFetchConditionResultsIDs() {
    (this.#ROOT
      .querySelector(':scope > .loading-view') as HTMLDivElement)
      .classList.remove('-shown');
  }
}
