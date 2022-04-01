import DefaultEventEmitter from './DefaultEventEmitter';
import StatisticsView from './StatisticsView';
import Records from './Records';
import {createPopupEvent} from '../functions/util';
import * as event from '../events';

export default class ResultsTable {
  #intersctionObserver;
  #tableData;
  #header;
  #hea___der;
  #statisticsViews;
  #ROOT;
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
    const TABLE = elm.querySelector(':scope > .body > table');
    this.#THEAD = TABLE.querySelector(':scope > thead > tr.header');
    this.#THEAD_SUB = TABLE.querySelector(':scope > thead > tr.subheader');
    this.#STATS = TABLE.querySelector(':scope > thead > tr.statistics');
    this.#TBODY = TABLE.querySelector(':scope > tbody');
    this.#TABLE_END = elm.querySelector(':scope > .body > .tableend');
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

    // event listener
    DefaultEventEmitter.addEventListener(event.selectTableData, e =>
      this.#setupTable(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.addNextRows, e =>
      this.#addTableRows(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.failedFetchTableDataIds, e =>
      this.#failed(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.highlightCol, e => {
      this.#colHighlight(e.detail);
    });

    // turnoff intersection observer after display transition
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-display'
        ) {
          if (mutation.target.dataset.display !== 'results') {
            this.#intersctionObserver.unobserve(this.#TABLE_END);
            // deselect table data
            this.#tableData.deselect();
          }
        }
      });
    });
    mutationObserver.observe(document.querySelector('body'), {
      attributes: true,
    });

    // statistics
    const controller = this.#STATS.querySelector(':scope > th.controller > .inner');
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
    const statisticsViewMoe = window.localStorage.getItem('statistics_view_moe');
    controller.querySelector(`:scope > label > input[value="${statisticsViewMoe}"]`)?.dispatchEvent(new MouseEvent('click'));
  }

  // private methods

  #enterTableEnd() {
    this.#intersctionObserver.unobserve(this.#TABLE_END);
    this.#tableData.next();
  }

  #setupTable(tableData) {

    // reset
    this.#tableData = tableData;
    this.#intersctionObserver.unobserve(this.#TABLE_END);
    this.#header = [
      ...tableData.dxCondition.valuesConditions.map(({catexxxgoryId, attributeId}) => {
        return {catexxxgoryId, attributeId};
      }),
      ...tableData.dxCondition.keyConditions.map(({catexxxgoryId, attributeId}) => {
        return {catexxxgoryId, attributeId};
      })
    ];
    this.#ROOT.classList.remove('-complete');
    this.#THEAD.innerHTML = '';
    this.#TBODY.innerHTML = '';
    this.#LOADING_VIEW.classList.add('-shown');
    DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));

    // make table header
    this.#THEAD.innerHTML = `
      <th rowspan="2">
        <div class="inner">
          <div class="togo-key-view">${
            Records.getDatasetLabel(tableData.togoKey)
          }</div>
        </div>
      </th>
      <th colspan="100%">
        <div class="inner -noborder"></div>
      </th>
      `;

    // makte table sub header
    this.#THEAD_SUB.innerHTML = `
    ${
      tableData.dxCondition.valuesConditions
        .map(
          valuesCondition => `
          <th>
            <div class="inner _catexxxgory-background-color" data-catexxxgory-id="${valuesCondition.catexxxgoryId}">
              <div class="togo-key-view">${Records.getDatasetLabel(valuesCondition.dataset)}</div>
              <span>${valuesCondition.label}</span>
            </div>
          </th>`
        )
        .join('')
    }
    ${
      tableData.dxCondition.keyConditions
        .map(
          keyCondition => `
          <th>
            <div class="inner _catexxxgory-color" data-catexxxgory-id="${keyCondition.catexxxgoryId}">
              <div class="togo-key-view">${Records.getDatasetLabel(keyCondition.dataset)}</div>
              <span>${keyCondition.label}</span>
            </div>
          </th>`
        )
        .join('')
    }`;

    // make stats
    for (const td of this.#STATS.querySelectorAll(':scope > td')) {
      td.remove();
    }
    for (const statisticsView of this.#statisticsViews) {
      statisticsView.destroy();
    }
    this.#statisticsViews = [];
    this.#tableData.dxCondition
    const conditions = [
      ...this.#tableData.dxCondition.valuesConditions,
      ...this.#tableData.dxCondition.keyConditions
    ];
    conditions.forEach((condition, index) => {
      const td = document.createElement('td');
      td.innerHTML = '<div class="inner"><div></div></div>';
      this.#STATS.append(td);
      this.#statisticsViews.push(new StatisticsView(this.#STATS, td.querySelector(':scope > .inner > div'), tableData, index, condition));
    });
  }

  #addTableRows({done, offset, rows, tableData}) {

    this.#tableData = tableData;

    // make table
    this.#TBODY.insertAdjacentHTML(
      'beforeend',
      rows
        .map((row, index) => {
          return `
          <tr
            data-index="${offset + index}"
            data-togo-id="${row.index.entry}">
            <td>
              <div class="inner">
                <ul>
                  <div
                    class="togo-key-view primarykey"
                    data-key="${tableData.togoKey}"
                    data-order="${[0, offset + index]}"
                    data-sub-order="0"
                    data-subject-id="primary"
                    data-unique-entry-id="${row.index.entry}">${row.index.entry}
                  </div>
                  <span>${row.index.label}</span>
                </ul>
              </div<
            </td>
            ${row.attributes
              .map((column, columnIndex) => {
                if (column) {
                  return `
                  <td><div class="inner"><ul>${column.items
                    .map((item, itemIndex) => {
                      return `
                      <li>
                        <div
                          class="togo-key-view"
                          data-order="${[
                            columnIndex + 1,
                            offset + index,
                          ]}"
                          data-sub-order="${itemIndex}"
                          data-key="${item.dataset}"
                          data-subject-id="${
                            this.#header[columnIndex].catexxxgoryId
                          }"
                          data-main-category-id="${
                            this.#header[columnIndex].attributeId
                          }"
                          data-sub-category-id="${
                            item.node
                          }"
                          data-unique-entry-id="${item.entry}"
                          >${item.entry}</div>
                        <span>${
                          item.label
                        }</span>
                      </li>`;
                    })
                    .join('')}</ul></div></td>`;
                } else {
                  return `<td><div class="inner -empty"></div></td>`;
                }
              })
              .join('')}
          </tr>`;
        })
        .join('')
    );

    // turn off auto-loading after last line is displayed
    if (done) {
      this.#ROOT.classList.add('-complete');
      this.#LOADING_VIEW.classList.remove('-shown');
    } else {
      this.#ROOT.classList.remove('-complete');
      this.#LOADING_VIEW.classList.add('-shown');
      this.#intersctionObserver.observe(this.#TABLE_END);
    }

    // Naming needs improvement but hierarcy for Popup screen is like below
    // Togo-key   (Uniprot)                        | primaryKey
    //  → Subject  (Gene)                          | category
    //    → Main-Category  (Expressed in tissues)  | attribute
    //      → Sub-Category  (Thyroid Gland)        | 
    //        → Unique-Entry (ENSG00000139304)     | categoryId ?
    rows.forEach((row, index) => {
      const actualIndex = offset + index;
      const tr = this.#TBODY.querySelector(`:scope > tr[data-index="${actualIndex}"]`);
      const uniqueEntries = tr.querySelectorAll('.togo-key-view');
      uniqueEntries.forEach(uniqueEntry => {
        uniqueEntry.addEventListener('click', () => {
          createPopupEvent(uniqueEntry, event.showPopup);
        });
        // remove highlight on mouseleave only when there is no popup
        const td = uniqueEntry.closest('td');
        td.addEventListener('mouseenter', () => {
          const customEvent = new CustomEvent(event.highlightCol, {
            detail: uniqueEntry.getAttribute('data-order').split(',')[0],
          });
          DefaultEventEmitter.dispatchEvent(customEvent);
        });
        td.addEventListener('mouseleave', () => {
          if (document.querySelector('#ResultDetailModal').innerHTML === '') {
            this.#TBODY
              .querySelectorAll('td')
              .forEach(td => td.classList.remove('-selected'));
          }
        });
      });
    });

  }

  #failed(tableData) {
    this.#ROOT.classList.add('-complete');
    this.#LOADING_VIEW.classList.remove('-shown');
  }

  #colHighlight(colIndex) {
    this.#TBODY.querySelectorAll('[data-order]').forEach(element => {
      const td = element.closest('td');
      if (element.getAttribute('data-order').split(',')[0] === colIndex) {
        if (!td.classList.contains('.-selected')) {
          td.classList.add('-selected');
        }
      } else {
        td.classList.remove('-selected');
      }
    });
  }
}
