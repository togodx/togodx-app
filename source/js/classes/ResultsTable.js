import DefaultEventEmitter from './DefaultEventEmitter';
import StatisticsView from './StatisticsView';
import Records from './Records';
import {createPopupEvent} from '../functions/util';
import * as event from '../events';

export default class ResultsTable {
  #intersctionObserver;
  #tableData;
  #header;
  #ROOT;
  #THEAD;
  #THEAD_SUB;
  #STATS;
  #TBODY;
  #TABLE_END;
  #LOADING_VIEW;

  constructor(elm) {
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
  }

  // private methods

  #enterTableEnd() {
    this.#intersctionObserver.unobserve(this.#TABLE_END);
    this.#tableData.next();
  }

  #setupTable(tableData) {
    const properties = tableData.condition.attributes.concat(
      tableData.condition.properties
    );

    // reset
    this.#tableData = tableData;
    this.#intersctionObserver.unobserve(this.#TABLE_END);
    this.#header = properties.map(property => {
      return {
        subjectId: property.subject.subjectId,
        propertyId: property.property.propertyId,
      };
    });
    this.#ROOT.classList.remove('-complete');
    this.#THEAD.innerHTML = '';
    this.#TBODY.innerHTML = '';
    this.#LOADING_VIEW.classList.add('-shown');
    DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));

    // make table header
    this.#THEAD.innerHTML = `
      <th rowspan="2">
        <div class="inner">
          <div class="togo-key-view">${Records.getLabelFromTogoKey(
            tableData.condition.togoKey
          )}</div>
        </div>
      </th>
      <th colspan="100%">
        <div class="inner -noborder"></div>
      </th>
      `;

    // makte table sub header
    this.#THEAD_SUB.innerHTML = `
    ${tableData.condition.attributes
      .map(
        property => `
    <th>
      <div class="inner _subject-background-color" data-subject-id="${property.subject.subjectId}">
      <div class="togo-key-view">${property.property.primaryKey}</div>
        <span>${property.property.label}</span>
      </div>
    </th>`
      )
      .join('')}
    ${tableData.condition.properties
      .map(
        property => `
    <th>
      <div class="inner _subject-color" data-subject-id="${property.subject.subjectId}">
        <div class="togo-key-view">${property.property.primaryKey}</div>
        <span>${
          property.parentCategoryId
            ? Records.getValue(property.query.propertyId, property.parentCategoryId).label
            : property.property.label
        }</span>
      </div>
    </th>`
      )
      .join('')}`;

    // make stats
    this.#STATS.innerHTML =
      `<td><div class="inner"><div></td>` +
      properties
        .map(() => `<td><div class="inner"><div></div></div></td>`)
        .join('');
    this.#STATS
      .querySelectorAll(':scope > td > .inner > div')
      .forEach((elm, index) => {
        if (index === 0) return;
        new StatisticsView(elm, properties[index - 1]);
      });
  }

  #addTableRows(detail) {
    console.log(detail);

    this.#tableData = detail.tableData;

    // normalize
    const rows = [];
    detail.rows.forEach(row => {
      rows.push([
        ...detail.tableData.serializedHeader.map(head =>
          row.properties.find(property => property.propertyId === head)
        ),
      ]);
    });

    // make table
    this.#TBODY.insertAdjacentHTML(
      'beforeend',
      rows
        .map((row, index) => {
          // console.log(row);
          return `<tr data-index="${
            detail.tableData.offset + index
          }" data-togo-id="${detail.rows[index].id}">
            <td>
              <div class="inner">
                <ul>
                  <div
                    class="togo-key-view primarykey"
                    data-key="${detail.tableData.togoKey}"
                    data-order= "${[0, detail.tableData.offset + index]}"
                    data-sub-order= "0"
                    data-subject-id="${detail.tableData.subjectId}"
                    data-unique-entry-id="${detail.rows[index].id}">${
            detail.rows[index].id
          }
                  </div>
                  <span>${detail.rows[index].label}</span>
                </ul>
              </div<
            </td>
            ${row
              .map((column, columnIndex) => {
                // console.log(column)
                if (column) {
                  return `
                  <td><div class="inner"><ul>${column.attributes
                    .map((attribute, attributeIndex) => {
                      if (!attribute.attribute) console.error(attribute);
                      return `
                      <li>
                        <div
                          class="togo-key-view"
                          data-order="${[
                            columnIndex + 1,
                            detail.tableData.offset + index,
                          ]}"
                          data-sub-order="${attributeIndex}"
                          data-key="${column.propertyKey}"
                          data-subject-id="${
                            this.#header[columnIndex].subjectId
                          }"
                          data-main-category-id="${
                            this.#header[columnIndex].propertyId
                          }"
                          data-sub-category-id="${
                            attribute.attribute.categoryId
                              ? attribute.attribute.categoryId
                              : attribute.attribute.categoryIds
                          }"
                          data-unique-entry-id="${attribute.id}"
                          >${attribute.id}</div>
                        <span>${
                          attribute.attribute
                            ? attribute.attribute.label
                            : attribute
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
    if (detail.done) {
      this.#ROOT.classList.add('-complete');
      this.#LOADING_VIEW.classList.remove('-shown');
    } else {
      this.#ROOT.classList.remove('-complete');
      this.#LOADING_VIEW.classList.add('-shown');
      this.#intersctionObserver.observe(this.#TABLE_END);
    }

    // Naming needs improvement but hierarcy for Popup screen is like below
    // Togo-key   (Uniprot)
    //  → Subject  (Gene)
    //    → Main-Category  (Expressed in tissues)
    //      → Sub-Category  (Thyroid Gland)
    //        → Unique-Entry (ENSG00000139304)
    rows.forEach((row, index) => {
      const actualIndex = detail.tableData.offset + index;
      const tr = this.#TBODY.querySelector(
        `:scope > tr[data-index="${actualIndex}"]`
      );

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
    console.log(tableData);
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
