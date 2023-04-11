import ConditionBuilder from './ConditionBuilder';
import DefaultEventEmitter from './DefaultEventEmitter';
import StatisticsView from './StatisticsView';
import Records from './Records';
import ResultsTableRow from './ResultsTableRow';
import * as event from '../events';

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
  #intersctionObserver;
  #conditionResults;
  #statisticsViews;
  #header;
  #previewDxCondition;
  #ROOT;
  #NUMBER_OF_ENTRIES;
  #COLLAPSE_BUTTON;
  #COLGROUP;
  #THEAD;
  #STATS;
  #TBODY;
  #TABLE_END;
  #LOADING_VIEW;

  constructor(elm) {
    this.#statisticsViews = [];

    // references
    this.#ROOT = elm;
    const header = elm.querySelector(':scope > header');
    this.#NUMBER_OF_ENTRIES = header.querySelector(
      ':scope > span > span.count'
    );
    this.#COLLAPSE_BUTTON = header.querySelector(
      ':scope > .collapsenotchbutton'
    );
    const inner = elm.querySelector(':scope > .inner');
    const TABLE = inner.querySelector(':scope > table');
    this.#COLGROUP = TABLE.querySelector(':scope > colgroup');
    this.#THEAD = TABLE.querySelector(':scope > thead > tr.header');
    this.#STATS = TABLE.querySelector(':scope > thead > tr.statistics');
    this.#TBODY = TABLE.querySelector(':scope > tbody');
    this.#TABLE_END = inner.querySelector(':scope > .tableend');
    this.#LOADING_VIEW = this.#TABLE_END.querySelector(
      ':scope > .loading-view'
    );

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
      const currentDisplay = document.body.dataset.display;
      document.body.dataset.display = displayMap.get(currentDisplay);
      if (currentDisplay === 'properties')
        ConditionBuilder.makeQueryParameter();
    });

    // event listeners
    DefaultEventEmitter.addEventListener(
      event.mutateEstablishConditions,
      this.#makePreview.bind(this)
    );
    DefaultEventEmitter.addEventListener(event.selectConditionResults, e =>
      this.#setupTable(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.addNextRows, e =>
      this.#addNextRows(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.highlightColumn, e => {
      this.#highlightColumn(e.detail);
    });
    DefaultEventEmitter.addEventListener(
      event.failedFetchConditionResultsIDs,
      e => this.#failed(e.detail)
    );

    // statistics
    const controller = this.#STATS.querySelector(
      ':scope > th.controller > .inner'
    );
    controller.querySelectorAll(':scope > label > input').forEach(radio => {
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
        const customEvent = new CustomEvent(event.changeStatisticsViewMode);
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
    this.#conditionResults.next();
  }

  async #makePreview() {
    if ((document.body.dataset.display = 'properties')) {
      this.#TBODY.innerHTML = '';
      this.#previewDxCondition = ConditionBuilder.dxCondition;
      // get IDs
      const ids = await this.#previewDxCondition.ids;
      this.#header = this.#previewDxCondition.tableHeader;
      // make table header
      this.#NUMBER_OF_ENTRIES.innerHTML = `${ids.length.toLocaleString()} ${prMapEntry.get(
        new Intl.PluralRules('en-US').select(ids.length)
      )}`;
      this.#makeTableHeader(this.#previewDxCondition);
      // make rows
      document.body.dataset.numberOfResults = ids.length;
      const nextRows = await this.#previewDxCondition.getNextProperties(
        NUM_OF_PREVIEW
      );
      this.#addNextRows({
        dxCondition: this.#previewDxCondition,
        offset: 0,
        nextRows,
        isAutoLoading: false,
        isPreview: true,
      });
    }
  }

  #setupTable(conditionResults) {
    if ((document.body.dataset.display = 'results')) {
      // reset
      this.#conditionResults = conditionResults;
      this.#intersctionObserver.unobserve(this.#TABLE_END);
      this.#header = conditionResults.dxCondition.tableHeader;
      this.#ROOT.classList.remove('-complete');
      this.#THEAD.innerHTML = '';
      this.#TBODY.innerHTML = '';
      this.#LOADING_VIEW.classList.add('-shown');
      DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));

      this.#makeTableHeader(conditionResults.dxCondition);
      this.#makeStats(conditionResults.dxCondition);
    }
  }

  #makeTableHeader(dxCondition) {
    // make column group
    this.#COLGROUP.innerHTML = '<col></col>'.repeat(
      dxCondition.conditionUtilityFilters.length +
        dxCondition.conditionUtilityAnnotations.length +
        1
    );
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
                <div class="togo-key-view">${Records.getDatasetLabel(
                  conditionUtilityFilter.dataset
                )}</div>
                <span>${conditionUtilityFilter.label}</span>
              </div>
            </th>`;
        })
        .join('')}
      ${dxCondition.conditionUtilityAnnotations
        .map(
          conditionUtilityAnnotation => `
            <th>
              <div class="inner _category-color" data-category-id="${
                conditionUtilityAnnotation.categoryId
              }">
                <div class="togo-key-view">${Records.getDatasetLabel(
                  conditionUtilityAnnotation.dataset
                )}</div>
                <span>${conditionUtilityAnnotation.label}</span>
              </div>
            </th>`
        )
        .join('')}
      `;
  }

  #makeStats(dxCondition) {
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
          td.querySelector(':scope > .inner > div'),
          this.#conditionResults,
          index,
          condition
        )
      );
    });
  }

  #addNextRows({dxCondition, offset, nextRows, isPreview = false}) {
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
          this.#header,
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

  #highlightColumn({x, isEnter, oldCell, newCell}) {
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
    this.#COLGROUP
      .querySelector(`:scope > col:nth-child(${+newCell.x + 1})`)
      .classList.add('-selected');
    this.#TBODY
      .querySelector(`:scope > tr[data-index="${newCell.y}"]`)
      .classList.add('-selected');
  }

  #failed() {
    this.#ROOT.classList.add('-complete');
    this.#LOADING_VIEW.classList.remove('-shown');
  }
}
