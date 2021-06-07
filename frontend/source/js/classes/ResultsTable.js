import DefaultEventEmitter from './DefaultEventEmitter';
import StatisticsView from './StatisticsView';
import Records from './Records';
import * as event from '../events';

export default class ResultsTable {
  #intersctionObserver;
  #tableData;
  #header;
  #ROOT;
  #THEAD;
  #STATS;
  #TBODY;
  #TABLE_END;
  #LOADING_VIEW;

  constructor(elm) {
    // references
    this.#ROOT = elm;
    const TABLE = elm.querySelector(':scope > .body > table');
    this.#THEAD = TABLE.querySelector(':scope > thead > tr.header');
    this.#STATS = TABLE.querySelector(':scope > thead > tr.statistics');
    this.#TBODY = TABLE.querySelector(':scope > tbody');
    this.#TABLE_END = elm.querySelector(':scope > .body > .tableend');
    this.#LOADING_VIEW = this.#TABLE_END.querySelector(
      ':scope > .loading-view'
    );

    // get next data automatically
    this.#intersctionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.#TABLE_END) {
          if (entry.isIntersecting) {
            this.#enterTableEnd();
          }
        }
      }
    });

    // event listener
    DefaultEventEmitter.addEventListener(event.selectTableData, (e) =>
      this.#setupTable(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.addNextRows, (e) =>
      this.#addTableRows(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.failedFetchTableDataIds, (e) =>
      this.#failed(e.detail)
    );

    // turnoff intersection observer after display transition
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
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
    this.#header = properties.map((property) => {
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
      <th>
        <div class="inner">Report</div>
      </th>
      <th>
        <div class="inner">
          <div class="togo-key-view">${Records.getLabelFromTogoKey(tableData.condition.togoKey)}</div>
        </div>
      </th>
      ${tableData.condition.attributes
        .map(
          (property) => `
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
          (property) => `
      <th>
        <div class="inner _subject-color" data-subject-id="${property.subject.subjectId}">
          <div class="togo-key-view">${property.property.primaryKey}</div>
          <span>${property.subCategory ? property.subCategory.label : property.property.label}</span>
        </div>
      </th>`
        )
        .join('')}`;

    // make stats
    this.#STATS.innerHTML =
      `<td colspan="2"><div class="inner"><div></td>` +
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
    detail.rows.forEach((row) => {
      rows.push([
        ...detail.tableData.serializedHeader.map((head) =>
          row.properties.find((property) => property.propertyId === head)
        ),
      ]);
    });

    // make table
    this.#TBODY.insertAdjacentHTML(
      'beforeend',
      rows
        .map((row, index) => {
          console.log(row);
          return `<tr data-index="${detail.tableData.offset + index}" data-togo-id="${detail.rows[index].id}">
            <th>
              <div class="inner">
                <a class="report-page-button-view" href="report.html?togoKey=${detail.tableData.togoKey}&id=${detail.rows[index].id}&properties=${window.btoa(RawDeflate.deflate(encodeURIComponent(JSON.stringify(row))))}" target="_blank"><span class="material-icons-outlined">open_in_new</span></a>
              </div>
            </th>
            <td>
              <div class="inner">
                <ul>
                  <div
                    class="togo-key-view primarykey"
                    data-key="${detail.tableData.togoKey}"
                    data-order= "${[0, index]}"
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
                    .map((attribute) => {
                      if (!attribute.attribute) console.error(attribute);
                      return `
                      <li>
                        <div
                          class="togo-key-view"
                          data-order="${[columnIndex + 1, index]}"
                          data-key="${column.propertyKey}"
                          data-subject-id="${this.#header[columnIndex].subjectId}"
                          data-main-category-id="${
                            this.#header[columnIndex].propertyId
                          }"
                          data-sub-category-id="${
                            attribute.attribute.categoryId
                              ? attribute.attribute.categoryId
                              : attribute.attribute.categoryIds
                          }"
                          data-unique-entry-id="${attribute.id}"
                          data-unique-entry-uri="${attribute.attribute.uri}"
                          >${attribute.id}</div>
                        <span>${
                            attribute.attribute ? attribute.attribute.label : attribute
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
      const reportLink = `report.html?togoKey=${this.#tableData.togoKey}&id=${tr.getAttribute('data-togo-id')}&properties=${encodeURIComponent(JSON.stringify(row))}`
      const uniqueEntries = tr.querySelectorAll('.togo-key-view');
      uniqueEntries.forEach((uniqueEntry) => {
        uniqueEntry.addEventListener('click', () => {
          this.createPopupEvent(uniqueEntry, tr, reportLink, event.showPopup);
        });
      });
    });
  }

  #failed(tableData) {
    console.log(tableData);
    this.#ROOT.classList.add('-complete');
    this.#LOADING_VIEW.classList.remove('-shown');
  }

  // public methods
  // TODO: Set better way to get reportLink
  createPopupEvent(uniqueEntry, tr, reportLink, newEvent) {
    // if (!tr.classList.contains('.-selected')) {
    //   tr.classList.add('.-selected');
    // };
    // uniqueEntry.classList.add('.-selected');
    const customEvent = new CustomEvent(newEvent, {
      detail: {
        keys: {
          dataKey: uniqueEntry.getAttribute('data-key'),
          subjectId: uniqueEntry.getAttribute('data-subject-id'),
          mainCategoryId: uniqueEntry.getAttribute(
            'data-main-category-id'
          ),
          subCategoryId: uniqueEntry.getAttribute(
            'data-sub-category-id'
          ),
          uniqueEntryId: uniqueEntry.getAttribute(
            'data-unique-entry-id'
          ),
        },
        properties: {
          dataOrder: uniqueEntry.getAttribute('data-order'),
          isPrimaryKey: uniqueEntry.classList.contains('primarykey'),
          reportLink: reportLink,
        },
      }
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }
}