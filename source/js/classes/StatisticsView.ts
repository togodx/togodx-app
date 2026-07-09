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
    // distribution attributes are re-binned (variable bin width, zero-fill,
    // outlier lumping); classification keeps the 1 node = 1 bar behavior
    const displayValues: HitValue[] = this.#isDistribution()
      ? this.#buildDistributionBins(uniquedAttributes)
      : this.#buildClassificationValues(uniquedAttributes);

    // max
    let countMax: number;
    const isOnlyHitCount = this.#ROOT_NODE.classList.contains('-onlyhitcount');
    const isStretch =
      !isOnlyHitCount && this.#ROOT_NODE.classList.contains('-stretch');
    if (isOnlyHitCount) {
      countMax = Math.max(1, ...displayValues.map(filter => filter.hitCount));
    } else {
      countMax = Math.max(1, ...displayValues.map(filter => filter.count));
    }

    displayValues.reduce((lastBar: undefined | HTMLDivElement, hitValue) => {
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
        hitbarHeight = count > 0 ? hitCount / count : 0;
        hitCountLabel.textContent = count > 0
          ? `${Math.round((hitCount / count) * 100)}%`
          : '0%';
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

  #isDistribution(): boolean {
    return Records.getAttribute(this.#attributeId)?.datamodel === 'distribution';
  }

  // classification: 1 reference node = 1 bar, empty (unmapped) nodes omitted
  #buildClassificationValues(
    uniquedAttributes: DataFrameAttributeItem[]
  ): HitValue[] {
    const values: HitValue[] = [];
    this.#referenceNodes?.forEach(({node, label, count}) => {
      const filtered = uniquedAttributes.filter(
        attribute => attribute.node === node
      );
      if (filtered.length === 0) return;
      values.push({node, label, count, hitCount: filtered.length});
    });
    return values;
  }

  // distribution: nodes are consecutive integer bins. Zero-fill missing bins,
  // group consecutive bins so there are <= MAX_DISTRIBUTION_BINS bars, and lump
  // the long upper tail (beyond the cumulative 99% of the population) into a
  // final "overflow" bar.
  #buildDistributionBins(
    uniquedAttributes: DataFrameAttributeItem[]
  ): HitValue[] {
    const MAX_DISTRIBUTION_BINS = 20;
    const CUMULATIVE_CUTOFF = 0.99;

    const refs = this.#referenceNodes ?? [];
    if (refs.length === 0) return [];

    // population count / label per integer bin id
    const popCount = new Map<number, number>();
    const popLabel = new Map<number, string>();
    let minBin = Infinity;
    let maxBin = -Infinity;
    for (const {node, label, count} of refs) {
      const id = parseInt(node, 10);
      if (Number.isNaN(id)) continue;
      popCount.set(id, count);
      if (label != null) popLabel.set(id, label);
      if (id < minBin) minBin = id;
      if (id > maxBin) maxBin = id;
    }
    if (!Number.isFinite(minBin)) return [];

    // hits per integer bin id
    const hitByBin = new Map<number, number>();
    for (const item of uniquedAttributes) {
      const id = parseInt(item.node, 10);
      if (Number.isNaN(id)) continue;
      hitByBin.set(id, (hitByBin.get(id) ?? 0) + 1);
    }

    // total population (zero-filled range)
    let total = 0;
    for (let id = minBin; id <= maxBin; id++) total += popCount.get(id) ?? 0;

    // cumulative-99% cutoff: bins above it are lumped into the overflow bar
    let cutoffBin = maxBin;
    if (total > 0) {
      let cumulative = 0;
      for (let id = minBin; id <= maxBin; id++) {
        cumulative += popCount.get(id) ?? 0;
        if (cumulative >= total * CUMULATIVE_CUTOFF) {
          cutoffBin = id;
          break;
        }
      }
    }
    const hasOverflow = cutoffBin < maxBin;

    // group size so the total number of bars stays within the limit
    const rangeLength = cutoffBin - minBin + 1;
    const maxGroups = Math.max(1, MAX_DISTRIBUTION_BINS - (hasOverflow ? 1 : 0));
    const groupSize = Math.max(1, Math.ceil(rangeLength / maxGroups));

    const aggregate = (from: number, to: number) => {
      let count = 0;
      let hitCount = 0;
      let firstLabel: string | undefined;
      let lastLabel: string | undefined;
      for (let id = from; id <= to; id++) {
        count += popCount.get(id) ?? 0;
        hitCount += hitByBin.get(id) ?? 0;
        const label = popLabel.get(id);
        if (label != null) {
          if (firstLabel === undefined) firstLabel = label;
          lastLabel = label;
        }
      }
      return {count, hitCount, firstLabel, lastLabel};
    };

    const bins: HitValue[] = [];
    for (let start = minBin; start <= cutoffBin; start += groupSize) {
      const end = Math.min(start + groupSize - 1, cutoffBin);
      const {count, hitCount, firstLabel, lastLabel} = aggregate(start, end);
      bins.push({
        node: `${start}-${end}`,
        label: this.#mergeRangeLabel(firstLabel, lastLabel, start, end),
        count,
        hitCount,
      });
    }
    if (hasOverflow) {
      const {count, hitCount, firstLabel} = aggregate(cutoffBin + 1, maxBin);
      bins.push({
        node: `${cutoffBin + 1}+`,
        label: this.#overflowLabel(firstLabel, cutoffBin + 1),
        count,
        hitCount,
      });
    }
    return bins;
  }

  // leading number of a bin label, e.g. "40-50 kDa" -> "40"
  #parseRangeStart(label?: string): string | undefined {
    if (!label) return undefined;
    const matched = label.match(/-?\d+(?:\.\d+)?/);
    return matched ? matched[0] : undefined;
  }

  // trailing part of a bin label, e.g. "40-50 kDa" -> "50 kDa"
  #parseRangeEnd(label?: string): string | undefined {
    if (!label) return undefined;
    const parts = label.split(/[-–]/);
    return (parts.length > 1 ? parts.slice(1).join('-') : parts[0]).trim();
  }

  #mergeRangeLabel(
    firstLabel: string | undefined,
    lastLabel: string | undefined,
    startId: number,
    endId: number
  ): string {
    if (startId === endId && firstLabel) return firstLabel;
    const start = this.#parseRangeStart(firstLabel);
    const end = this.#parseRangeEnd(lastLabel);
    if (start !== undefined && end !== undefined) return `${start}–${end}`;
    return `#${startId}–${endId}`;
  }

  #overflowLabel(firstLabel: string | undefined, startId: number): string {
    const start = this.#parseRangeStart(firstLabel);
    return start !== undefined ? `≥ ${start}` : `≥ #${startId}`;
  }

  #failedFetchConditionResultsIDs() {
    this.#LOADING_VIEW.classList.remove('-shown');
  }
}
