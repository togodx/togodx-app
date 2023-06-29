import DefaultEventEmitter from './DefaultEventEmitter.ts';
import Dataset from './Dataset.ts';
import {createPopupEvent} from '../functions/util.ts';
import {
  DataFrame, TableHeader, DatasetIds
} from '../interfaces.ts';
import * as events from '../events.js';

export default class ResultsTableRow {
  #ROOT;
  #TBODY;

  constructor(
    index: number,
    dataset: string,
    tbody: HTMLTableSectionElement,
    header: TableHeader[],
    row: DataFrame
  ) {
    this.#ROOT = document.createElement('tr') as HTMLTableRowElement;
    this.#ROOT.dataset.index = String(index);
    this.#ROOT.dataset.togoId = row.index.entry;
    this.#ROOT.dataset.entry = row.index.entry;
    this.#TBODY = tbody;
    const tds = [
      {
        items: [
          {
            dataset: dataset,
            entry: row.index.entry,
            label: row.index.label,
          },
        ],
      },
      ...row.attributes,
    ].map((column, columnIndex) => {
      const td = document.createElement('td');
      td.dataset.x = columnIndex.toString();
      td.dataset.y = index.toString();
      td.innerHTML = `<div class="inner">
        <ul>
        ${column.items
          .map(
            (item, itemIndex) => {
              return `<li>
                <div class="mainkeyvalue">
                  <div class="togo-key-view${
                    columnIndex === 0 ? ' primarykey' : ''
                  }"
                    data-x="${[columnIndex]}"
                    data-y="${[index]}"
                    data-y2="${itemIndex}"
                    data-dataset="${item.dataset}"
                    data-category-id="${
                      columnIndex === 0
                        ? 'primary'
                        : header[columnIndex - 1].categoryId
                    }"
                    ${
                      columnIndex === 0
                        ? ''
                        : `data-attribute-id="${
                            header[columnIndex - 1].attributeId
                          }" data-node="${item.node}"`
                    }
                    data-entry="${item.entry}"
                  >${item.entry}</div>
                  <span>${item.label}</span>
                </div>
              </li>`;
            }
          )
          .join('')}
        </ul>
      </div>`;

      // remove highlight on mouseleave only when there is no popup
      td.addEventListener('mouseenter', () => {
        const oldTd = this.#TBODY.querySelector('td.-highlighting') as HTMLTableCellElement;
        oldTd?.classList.remove('-highlighting');
        td.classList.add('-highlighting');
        const customEvent = new CustomEvent(events.highlightColumn, {
          detail: {
            x: +(td.dataset.x as string),
            isEnter: true,
            oldCell: {
              x: +(oldTd?.dataset.x as string),
              y: +(oldTd?.dataset.y as string),
            },
            newCell: {
              x: +(td.dataset.x as string),
              y: +(td.dataset.y as string),
            },
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
      });
      // td.addEventListener('mouseleave', () => {
      //   const customEvent = new CustomEvent(event.highlightColumn, {
      //     detail: {
      //       x: +td.dataset.x,
      //       isEnter: false,
      //     },
      //   });
      //   DefaultEventEmitter.dispatchEvent(customEvent);
      // });

      // naming needs improvement but hierarcy for Popup screen is like below
      td.querySelectorAll<HTMLDivElement>('.togo-key-view').forEach(togoKeyView => {
        togoKeyView.addEventListener('click', () => {
          createPopupEvent(togoKeyView, events.showStanza);
        });
      });

      return td;
    });
    this.#ROOT.append(...tds);
  }

  makeDetail() {
    this.#ROOT.querySelectorAll<HTMLDivElement>('.togo-key-view').forEach(togoKeyView => {
      const expanded = Dataset.getExpandedItem(togoKeyView.dataset.dataset as string, togoKeyView.dataset.entry as string);
      if (expanded) {
        const dl = document.createElement('dl');
        dl.innerHTML = Object.keys(expanded).map(key => {
          return key === 'id' ? '' : `
          <dt>${key}</dt>
          <dd>${expanded[key]}</dd>`
        }).join('');
        togoKeyView.parentElement?.after(dl);
      }
    })
  }

  get elm() {
    return this.#ROOT;
  }
  get datasetIds() {
    const datasetIds: DatasetIds = {};
    const setId = (dataset: string, id: string) => {
      if (!datasetIds[dataset]) datasetIds[dataset] = new Set();
      datasetIds[dataset].add(id);
    }
    this.#ROOT.querySelectorAll<HTMLDivElement>('.togo-key-view').forEach(elm => {
      setId(elm.dataset.dataset as string, elm.dataset.entry as string);
    });
    return datasetIds;
  }
}
