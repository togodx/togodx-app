import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import StatisticsView from "./StatisticsView";
import * as event from '../events';

export default class ResultsTable {

  #intersctionObserver;
  #tableData;
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
    this.#LOADING_VIEW = this.#TABLE_END.querySelector(':scope > .loading-view');

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
    DefaultEventEmitter.addEventListener(event.selectTableData, e => this.#setupTable(e.detail));
    DefaultEventEmitter.addEventListener(event.addNextRows, e => this.#addTableRows(e.detail));
    DefaultEventEmitter.addEventListener(event.failedFetchTableDataIds, e => this.#failed(e.detail));

    // turnoff intersection observer after display transition
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-display') {
          if (mutation.target.dataset.display !== 'results') {
            this.#intersctionObserver.unobserve(this.#TABLE_END);
            // deselect table data
            this.#tableData.deselect();
          }
        }
      });
    });
    mutationObserver.observe(
      document.querySelector('body'),
      {attributes: true}
    );
  }

  // private methods

  #enterTableEnd() {
    this.#intersctionObserver.unobserve(this.#TABLE_END);
    this.#tableData.next();
  }

  #setupTable(tableData) {

    const properties = tableData.condition.attributes.concat(tableData.condition.properties);
    console.log(properties)

    // reset
    this.#tableData = tableData;
    this.#intersctionObserver.unobserve(this.#TABLE_END);
    this.#ROOT.classList.remove('-complete');
    this.#THEAD.innerHTML = '';
    this.#TBODY.innerHTML = '';
    this.#LOADING_VIEW.classList.add('-shown');
    DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));

    // make table header
    this.#THEAD.innerHTML = `
      <th>
        <div class="inner">
          <div class="togo-key-view">${tableData.condition.togoKey}</div>
        </div>
      </th>
      ${tableData.condition.attributes.map(property => `
      <th>
        <div class="inner -propertyvalue" style="background-color: ${App.getHslColor(property.subject.hue)}">
          <div class="togo-key-view">${property.property.primaryKey}</div>
          <span>${property.property.label}</span>
        </div>
      </th>`).join('')}
      ${tableData.condition.properties.map(property => `
      <th>
        <div class="inner -property" style="color: ${App.getHslColor(property.subject.hue)}">
          <div class="togo-key-view">${property.property.primaryKey}</div>
          <span>${property.property.label}</span>
        </div>
      </th>`).join('')}`;

      // make stats
      this.#STATS.innerHTML = '<td><div class="inner"><div></td>' + properties.map(() => `<td><div class="inner"><div></div></div></td>`).join('');
      this.#STATS.querySelectorAll(':scope > td > .inner > div').forEach((elm, index) => {
        if (index === 0 ) return;
        new StatisticsView(elm, properties[index - 1]);
      });
  }

  #addTableRows(detail) {

    this.#tableData = detail.tableData;

    // normalize
    const rows = [];
    detail.rows.forEach(row => {
      rows.push([...detail.tableData.serializedHeader.map(head => row.properties.find(property => property.propertyId === head))]);
    });

    // make table
    this.#TBODY.insertAdjacentHTML('beforeend', rows.map((row, index) => {
      console.log(row)
      return `<tr data-index="${detail.tableData.offset + index}" data-togo-id="${detail.rows[index].id}">
        <th>
          <div class="inner">
            <a class="toreportpage" href="report.html?togoKey=${detail.tableData.togoKey}&id=${detail.rows[index].id}&properties=${encodeURIComponent(JSON.stringify(row))}" target="_blank"><span class="material-icons-outlined">open_in_new</span></a>
            <div class="togo-key-view" data-key="${detail.tableData.condition.togoKey}" data-id="${detail.rows[index].id}">${detail.rows[index].id}</div>
          </div>
        </th>
        ${row.map(column => {
          // console.log(column)
          if (column) {
            return `
              <td><div class="inner"><ul>${column.attributes.map(attribute => {
              if (!attribute.attribute) console.error(attribute);
              return `
              <li>
                <div class="togo-key-view" data-key="${column.propertyKey}" data-id="${attribute.id}">${attribute.id}</div>
                <a
                  href="${attribute.attribute ? attribute.attribute.uri : ''}"
                  title="${attribute.attribute ? attribute.attribute.uri : ''}"
                  target="_blank">${attribute.attribute ? attribute.attribute.label : attribute}</a>
              </li>`;
            }).join('')}</ul></div></td>`;
          } else {
            return '<td><div class="inner -empty"></div></td>';
          }
        }).join('')}
      </tr>`;
    }).join(''));

    // turn off auto-loading after last line is displayed
    if (detail.done) {
      this.#ROOT.classList.add('-complete');
      this.#LOADING_VIEW.classList.remove('-shown');
    } else {
      this.#ROOT.classList.remove('-complete');
      this.#LOADING_VIEW.classList.add('-shown');
      this.#intersctionObserver.observe(this.#TABLE_END);
    }

    // attach event
    rows.forEach((row, index) => {
      const actualIndex = detail.tableData.offset + index;
      const tr = this.#TBODY.querySelector(`:scope > tr[data-index="${actualIndex}"]`);
      tr.addEventListener('click', () => {
        if (tr.classList.contains('-selected')) {
          // hide stanza
          tr.classList.remove('-selected');
          DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));
        } else {
          // show stanza
          this.#TBODY.querySelectorAll(':scope > tr').forEach(tr => tr.classList.remove('-selected'));
          tr.classList.add('-selected');
          // dispatch event
          const customEvent = new CustomEvent(event.showStanza, {detail: {
            subject: {
              togoKey: this.#tableData.togoKey,
              id: this.#tableData.subjectId,
              value: tr.dataset.togoId
            },
            properties: row
          }});
          DefaultEventEmitter.dispatchEvent(customEvent);
        }
      })
    });
  }

  #failed(tableData) {
    console.log(tableData)
    this.#ROOT.classList.add('-complete');
    this.#LOADING_VIEW.classList.remove('-shown');
  }

}
