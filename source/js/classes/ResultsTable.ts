/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-constant-condition */
import ConditionBuilder from './ConditionBuilder.ts';
import ConditionResultsController from './ConditionResultsController.ts';
import DefaultEventEmitter from './DefaultEventEmitter.ts';
import StatisticsView from './StatisticsView.ts';
import Records from './Records.ts';
import DXCondition from './DXCondition.ts';
import ResultsTableRow from './ResultsTableRow.ts';
import * as events from '../events';
import {
  TableHeader, TableRow
} from '../interfaces.ts';

interface cellPosition {
  x: number;
  y: number;
}
interface HigllightColumn {
  x: number;
  isEnter: boolean;
  oldCell: cellPosition;
  newCell: cellPosition;
}

const NUM_OF_PREVIEW = 5;
const displayMap = new Map([
  ['properties', 'results'],
  ['results', 'properties'],
]);
const prMapEntry = new Map([
  ['one', 'entry'],
  ['other', 'entries'],
]);

export default class ResultsTable {
  #intersctionObserver: IntersectionObserver;
  #conditionResults: ConditionResultsController | undefined;
  #statisticsViews: StatisticsView[];
  #header: TableHeader[] | undefined;
  #previewDxCondition: DXCondition | undefined;
  #ROOT: HTMLElement;
  #NUMBER_OF_ENTRIES: HTMLSpanElement;
  #COLLAPSE_BUTTON: HTMLDivElement;
  #COLGROUP: HTMLTableColElement;
  #THEAD: HTMLTableRowElement;
  #STATS: HTMLTableRowElement;
  #TBODY: HTMLTableSectionElement;
  #TABLE_END: HTMLDivElement;
  #LOADING_VIEW: HTMLDivElement;

  constructor(elm: HTMLElement) {
    this.#statisticsViews = [];

    // references
    this.#ROOT = elm;
    const header = elm.querySelector(':scope > header') as HTMLElement;
    this.#NUMBER_OF_ENTRIES = header.querySelector(
      ':scope > span > span.count'
    ) as HTMLSpanElement;
    this.#COLLAPSE_BUTTON = header.querySelector(
      ':scope > .collapsenotchbutton'
    ) as HTMLDivElement;
    const inner = elm.querySelector(':scope > .inner') as HTMLDivElement;
    const TABLE = inner.querySelector(':scope > table') as HTMLTableElement;
    this.#COLGROUP = TABLE.querySelector(':scope > colgroup') as HTMLTableColElement;
    this.#THEAD = TABLE.querySelector(':scope > thead > tr.header') as HTMLTableRowElement;
    this.#STATS = TABLE.querySelector(':scope > thead > tr.statistics') as HTMLTableRowElement;
    this.#TBODY = TABLE.querySelector(':scope > tbody') as HTMLTableSectionElement;
    this.#TABLE_END = inner.querySelector(':scope > .tableend') as HTMLDivElement;
    this.#LOADING_VIEW = this.#TABLE_END.querySelector(
      ':scope > .loading-view'
    ) as HTMLDivElement;

    // get next data automatically
    this.#intersctionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === this.#TABLE_END) {
          if (entry.isIntersecting) {
            this.#enterTableEnd();
          }
        }
      }
    });

    // attach event
    this.#COLLAPSE_BUTTON.addEventListener('click', () => {
      const currentDisplay = document.body.dataset.display!;
      document.body.dataset.display = displayMap.get(currentDisplay);
      if (currentDisplay === 'properties')
        ConditionBuilder.makeQueryParameter();
    });

    // event listeners
    DefaultEventEmitter.addEventListener(
      events.mutateEstablishConditions,
      this.#makePreview.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      events.selectConditionResults,
      <EventListener>this.#setupTable.bind(this)
    );
    DefaultEventEmitter.addEventListener(events.addNextRows, e => {
      this.#addNextRows((e as CustomEvent).detail);
    }
    );
    DefaultEventEmitter.addEventListener(events.highlightColumn, e => {
      this.#highlightColumn((e as CustomEvent).detail);
    });
    DefaultEventEmitter.addEventListener(
      events.failedFetchConditionResultsIDs,
      () => this.#failed()
    );

    // statistics
    const controller = this.#STATS.querySelector(
      ':scope > th.controller > .inner'
    ) as HTMLDivElement;
    controller.querySelectorAll<HTMLInputElement>(':scope > label > input').forEach((radio) => {
      radio.addEventListener('change', () => {
        switch (radio.value) {
          case 'hits_all':
            this.#STATS.classList.remove('-onlyhitcount');
            this.#STATS.classList.remove('-stretch');
            break;
          case 'hits_all_percentage':
            this.#STATS.classList.remove('-onlyhitcount');
            this.#STATS.classList.add('-stretch');
            break;
          case 'hits_only':
            this.#STATS.classList.add('-onlyhitcount');
            this.#STATS.classList.remove('-stretch');
            break;
        }
        const customEvent = new CustomEvent(events.changeStatisticsViewMode);
        DefaultEventEmitter.dispatchEvent(customEvent);
        window.localStorage.setItem('statistics_view_moe', radio.value);
      });
    });
    const statisticsViewMoe = window.localStorage.getItem(
      'statistics_view_moe'
    );
    controller
      .querySelector(`:scope > label > input[value="${statisticsViewMoe}"]`)
      ?.dispatchEvent(new MouseEvent('click'));
  }

  // private methods

  #enterTableEnd() {
    this.#intersctionObserver.unobserve(this.#TABLE_END);
    this.#conditionResults?.next();
  }

  async #makePreview(e: Event) {
    const isEstablised = (e as CustomEvent<boolean>).detail;
    if (isEstablised && (document.body.dataset.display = 'properties')) {
      this.#TBODY.innerHTML = '';
      this.#previewDxCondition = ConditionBuilder.dxCondition;
      // get IDs
      const ids = await this.#previewDxCondition.getIDs();
      this.#header = this.#previewDxCondition.tableHeader;
      // make table header
      this.#NUMBER_OF_ENTRIES.innerHTML = `${ids.length.toLocaleString()} ${prMapEntry.get(
        new Intl.PluralRules('en-US').select(ids.length)
      )}`;
      this.#makeTableHeader(this.#previewDxCondition);
      // make rows
      document.body.dataset.numberOfResults = String(ids.length);
      const nextRows = await this.#previewDxCondition.getNextProperties(
        NUM_OF_PREVIEW
      );
      this.#addNextRows(
        {
          dxCondition: this.#previewDxCondition,
          offset: 0,
          nextRows,
        },
        true
      );
    }
  }

  async #setupTable(e: Event) {
    const conditionResults: ConditionResultsController = (e as CustomEvent).detail;
    if ((document.body.dataset.display = 'results')) {
      // reset
      this.#conditionResults = conditionResults;
      this.#intersctionObserver.unobserve(this.#TABLE_END);
      this.#header = conditionResults.dxCondition.tableHeader;
      this.#ROOT.classList.remove('-complete');
      this.#THEAD.innerHTML = '';
      this.#TBODY.innerHTML = '';
      this.#LOADING_VIEW.classList.add('-shown');
      DefaultEventEmitter.dispatchEvent(new CustomEvent(events.hideStanza));

      await this.#makeTableHeader(conditionResults.dxCondition);
      this.#makeStats(conditionResults.dxCondition);
    }
  }

  async #makeTableHeader(dxCondition: DXCondition) {

    // make column group
    this.#COLGROUP.innerHTML = '<col></col>'.repeat(
      dxCondition.conditionUtilityFilters.length +
        dxCondition.conditionUtilityAnnotations.length +
        1
    );
    // labels
    const labels: string[] = [];
    for (const cua of dxCondition.conditionUtilityAnnotations) {
      const label = await cua.fetchLabel();
      labels.push(label);
    }

    // make table header
    this.#THEAD.innerHTML = `
      <th>
        <div class="inner">
          <div class="togo-key-view">${Records.getDatasetLabel(
            dxCondition.togoKey
          )}</div>
        </div>
      </th>
      ${dxCondition.conditionUtilityFilters
        .map(conditionUtilityFilter => {
          return `
            <th>
              <div class="inner _category-background-color" data-category-id="${
                conditionUtilityFilter.categoryId
              }">
                <div class="mainkeyvalue">
                  <div class="togo-key-view">${Records.getDatasetLabel(
                    conditionUtilityFilter.dataset
                  )}</div>
                  <span>${conditionUtilityFilter.label}</span>
                </div>
              </div>
            </th>`;
        })
        .join('')}
      ${dxCondition.conditionUtilityAnnotations
        .map(
          (cua, i) => `
            <th>
              <div class="inner _category-color" data-category-id="${
                cua.categoryId
              }">
                <div class="togo-key-view">${Records.getDatasetLabel(
                  cua.dataset
                )}</div>
                <span>${labels[i]}</span>
              </div>
            </th>`)
        .join('')}
      `;
  }
  // async #labels() {

  // }

  #makeStats(dxCondition: DXCondition) {
    for (const td of this.#STATS.querySelectorAll(':scope > td')) {
      td.remove();
    }
    for (const statisticsView of this.#statisticsViews) {
      statisticsView.destroy();
    }
    this.#statisticsViews = [];
    dxCondition;
    const conditions = [
      ...dxCondition.conditionUtilityFilters,
      ...dxCondition.conditionUtilityAnnotations,
    ];
    conditions.forEach((condition, index) => {
      const td = document.createElement('td');
      td.innerHTML = '<div class="inner"><div></div></div>';
      this.#STATS.append(td);
      this.#statisticsViews.push(
        new StatisticsView(
          this.#STATS,
          td.querySelector(':scope > .inner > div') as HTMLDivElement,
          this.#conditionResults as ConditionResultsController,
          index,
          condition
        )
      );
    });
  }

  #addNextRows(tableRow: TableRow, isPreview = false) {
    const { dxCondition, offset, nextRows } = tableRow;
    const isValidPreview =
      document.body.dataset.display === 'properties' && isPreview;
    const isValidResults =
      document.body.dataset.display === 'results' &&
      !isPreview &&
      dxCondition === this.#conditionResults?.dxCondition;

    if (isValidPreview || isValidResults) {
      // make table
      const rows = nextRows.map((row, index) => {
        const tr = new ResultsTableRow(
          offset + index,
          dxCondition.togoKey,
          this.#TBODY,
          this.#header as TableHeader[],
          row
        );
        return tr.elm;
      });
      this.#TBODY.append(...rows);
    }

    // turn off auto-loading after last line is displayed
    if (isPreview || dxCondition.isPropertiesLoaded) {
      this.#ROOT.classList.add('-complete');
      this.#LOADING_VIEW.classList.remove('-shown');
    }
  }

  #highlightColumn(params: HigllightColumn) {
    const {x, isEnter, oldCell, newCell} = params;
    // TODO: ハイライト関係の最適化
    // if (oldCell.x) {
    //   this.#COLGROUP
    //     .querySelector(`:scope > col:nth-child(${+oldCell.x + 1})`)
    //     .classList.remove('-selected');
    //   this.#TBODY
    //     .querySelector(`:scope > tr[data-index="${oldCell.y}"]`)
    //     .classList.remove('-selected');
    // }
    this.#COLGROUP
      .querySelectorAll(`:scope > col.-selected`)
      .forEach(col => col.classList.remove('-selected'));
    this.#TBODY
      .querySelectorAll(`:scope > tr.-selected`)
      .forEach(tr => tr.classList.remove('-selected'));
    (this.#COLGROUP
      .querySelector(`:scope > col:nth-child(${+newCell.x + 1})`) as HTMLTableColElement)
      .classList.add('-selected');
    (this.#TBODY
      .querySelector(`:scope > tr[data-index="${newCell.y}"]`) as HTMLTableRowElement)
      .classList.add('-selected');
  }

  #failed() {
    this.#ROOT.classList.add('-complete');
    this.#LOADING_VIEW.classList.remove('-shown');
  }
}
