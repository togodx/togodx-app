import DefaultEventEmitter from './DefaultEventEmitter.ts';
import Records from './Records.ts';
import ConditionResultsController from './ConditionResultsController.ts';
import ConditionFilterUtility from './ConditionFilterUtility.ts';
import ConditionAnnotationUtility from './ConditionAnnotationUtility.ts';
import * as event from '../events.js';
import _ from 'lodash';
import { Breakdown, DataFrameAttributeItem } from '../interfaces.ts';

interface HitValue {
  node: string;
  label: string;
  count: number;
  hitCount: number;
}

export default class StatisticsView {
  #index;
  #attributeId;
  #conditionResults;
  #referenceNodes: Breakdown[] = [];
  #BARS;
  #ROOT;
  #ROOT_NODE;
  #LOADING_VIEW;

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
    this.#prepareReferenceNodes(condition);

    // references
    const container = elm.querySelector(':scope > .statistics') as HTMLDivElement;
    this.#BARS = container.querySelector(':scope > .bars') as HTMLDivElement;
    this.#LOADING_VIEW = elm.querySelector(':scope > .loading-view') as HTMLDivElement;

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
      event.failedFetchConditionResultsIDs,
      this.#failedFetchConditionResultsIDs.bind(this)
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
      event.failedFetchConditionResultsIDs,
      this.#failedFetchConditionResultsIDs.bind(this)
    );
  }

  async #prepareReferenceNodes(condition: ConditionFilterUtility | ConditionAnnotationUtility) {
    const attribute = Records.getAttribute(this.#attributeId);
    let breakdowns: Breakdown[] = [];
    if (condition instanceof ConditionFilterUtility) {
      // get single node
      breakdowns = await Promise.all(condition.nodes.map(nodeId => attribute.fetchNode(nodeId)));
    } else if (condition instanceof ConditionAnnotationUtility) {
      // get all nodes of parent node
      switch (attribute.datamodel) {
        case 'classification':
          breakdowns = await attribute.fetchHierarchicNode(condition.nodeId)
            .then(nodes => nodes.children);
          break;
        case 'distribution':
          breakdowns = await attribute.fetchFirstLevelNodes();
          break;
      }
    }
    this.#referenceNodes = [...breakdowns];
    this.#draw();
  }

  #draw(event?: Event) {
    const flattenedAttributes = this.#conditionResults.data
      .map(datum => datum.attributes[this.#index])
      .map(attribute => attribute.items)
      .flat();
    const uniquedAttributes: DataFrameAttributeItem[] = _.uniqWith(flattenedAttributes, (a, b) => {
      return a.entry === b.entry && a.node === b.node;
    });
    const hitVlues: HitValue[] = [];
    this.#referenceNodes?.forEach(({node, label, count}) => {
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
    let countMax: number;
    const isOnlyHitCount = this.#ROOT_NODE.classList.contains('-onlyhitcount');
    const isStretch =
      !isOnlyHitCount && this.#ROOT_NODE.classList.contains('-stretch');
    if (isOnlyHitCount) {
      countMax = Math.max(...hitVlues.map(filter => filter.hitCount));
    } else {
      countMax = Math.max(...hitVlues.map(filter => filter.count));
    }

    hitVlues.reduce((lastBar: undefined | HTMLDivElement, hitValue) => {
      const {node, label, count, hitCount} = hitValue;
      let bar = this.#BARS.querySelector(`:scope > .bar[data-node="${node}"]`) as HTMLDivElement;
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
      ((bar as HTMLDivElement).querySelector(':scope > .wholebar') as HTMLDivElement).style.height = `${
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
    }, undefined);

    if ((event as CustomEvent)?.detail?.dxCondition.isPropertiesLoaded) {
      this.#ROOT.classList.add('-completed');
      this.#LOADING_VIEW.classList.remove('-shown');
    }
  }

  #failedFetchConditionResultsIDs() {
    this.#LOADING_VIEW.classList.remove('-shown');
  }
}
