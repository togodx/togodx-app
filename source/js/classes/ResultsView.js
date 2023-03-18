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

export default class ResultsView {
  #intersctionObserver;
  #tableData;
  #statisticsViews;
  #header;
  #previewDxCondition;
  #ROOT;
  #NUMBER_OF_ENTRIES;
  #COLLAPSE_BUTTON;
  #THEAD;
  #THEAD_SUB;
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
    this.#THEAD = TABLE.querySelector(':scope > thead > tr.header');
    this.#THEAD_SUB = TABLE.querySelector(':scope > thead > tr.subheader');
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
    DefaultEventEmitter.addEventListener(event.selectTableData, e =>
      this.#setupTable(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.addNextRows, e =>
      this.#addNextRows(e.detail)
    );
    // DefaultEventEmitter.addEventListener(event.failedFetchTableDataIds, e =>
    //   this.#failed(e.detail)
    // );
    // DefaultEventEmitter.addEventListener(event.highlightCol, e => {
    //   this.#colHighlight(e.detail);
    // });
  }

  // private methods

  #enterTableEnd() {
    this.#intersctionObserver.unobserve(this.#TABLE_END);
    this.#tableData.next();
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

  #setupTable(tableData) {
    if ((document.body.dataset.display = 'results')) {
      // reset
      this.#tableData = tableData;
      this.#intersctionObserver.unobserve(this.#TABLE_END);
      this.#header = tableData.dxCondition.tableHeader;
      this.#ROOT.classList.remove('-complete');
      this.#THEAD.innerHTML = '';
      this.#TBODY.innerHTML = '';
      this.#LOADING_VIEW.classList.add('-shown');
      DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));

      this.#makeTableHeader(tableData.dxCondition);
      this.#makeStats(tableData.dxCondition);
    }
  }

  #makeTableHeader(dxCondition) {
    // make table header
    this.#THEAD.innerHTML = `
      <th rowspan="2">
        <div class="inner">
          <div class="togo-key-view">${Records.getDatasetLabel(
            dxCondition.togoKey
          )}</div>
        </div>
      </th>
      <th colspan="100%">
        <div class="inner -noborder"></div>
      </th>
      `;
    // makte table sub header
    this.#THEAD_SUB.innerHTML = `
    ${dxCondition.conditionFilters
      .map(conditionFilter => {
        return `
          <th>
            <div class="inner _category-background-color" data-category-id="${
              conditionFilter.categoryId
            }">
              <div class="togo-key-view">${Records.getDatasetLabel(
                conditionFilter.dataset
              )}</div>
              <span>${conditionFilter.label}</span>
            </div>
          </th>`;
      })
      .join('')}
    ${dxCondition.conditionAnnotations
      .map(
        conditionAnnotation => `
          <th>
            <div class="inner _category-color" data-category-id="${
              conditionAnnotation.categoryId
            }">
              <div class="togo-key-view">${Records.getDatasetLabel(
                conditionAnnotation.dataset
              )}</div>
              <span>${conditionAnnotation.label}</span>
            </div>
          </th>`
      )
      .join('')}`;
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
      ...dxCondition.conditionFilters,
      ...dxCondition.conditionAnnotations,
    ];
    conditions.forEach((condition, index) => {
      const td = document.createElement('td');
      td.innerHTML = '<div class="inner"><div></div></div>';
      this.#STATS.append(td);
      this.#statisticsViews.push(
        new StatisticsView(
          this.#STATS,
          td.querySelector(':scope > .inner > div'),
          this.#tableData,
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
      dxCondition === this.#tableData?.dxCondition;

    if (isValidPreview || isValidResults) {
      // make table
      const rows = nextRows.map((row, index) => {
        const tr = new ResultsTableRow(
          offset + index,
          dxCondition.togoKey,
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
}
