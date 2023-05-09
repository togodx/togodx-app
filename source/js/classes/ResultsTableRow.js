import DefaultEventEmitter from './DefaultEventEmitter.ts';
import {createPopupEvent} from '../functions/util.ts';
import * as event from '../events';

export default class ResultsTableRow {
  #ROOT;
  #TBODY;

  constructor(index, dataset, tbody, header, row) {
    this.#ROOT = document.createElement('tr');
    this.#ROOT.dataset.index = index;
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
      td.dataset.x = columnIndex;
      td.dataset.y = index;
      td.innerHTML = `<div class="inner">
        <ul>
        ${column.items
          .map(
            (item, itemIndex) => `<li>
            <div class="togo-key-view${columnIndex === 0 ? ' primarykey' : ''}"
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
          </li>`
          )
          .join('')}
        </ul>
      </div>`;

      // remove highlight on mouseleave only when there is no popup
      td.addEventListener('mouseenter', () => {
        const oldTd = this.#TBODY.querySelector('td.-highlighting');
        oldTd?.classList.remove('-highlighting');
        td.classList.add('-highlighting');
        const customEvent = new CustomEvent(event.highlightColumn, {
          detail: {
            x: +td.dataset.x,
            isEnter: true,
            oldCell: {
              x: +oldTd?.dataset.x,
              y: +oldTd?.dataset.y,
            },
            newCell: {
              x: +td.dataset.x,
              y: +td.dataset.y,
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
      td.querySelectorAll('.togo-key-view').forEach(togoKeyView => {
        togoKeyView.addEventListener('click', () => {
          createPopupEvent(togoKeyView, event.showStanza);
        });
      });

      return td;
    });
    this.#ROOT.append(...tds);
  }

  get elm() {
    return this.#ROOT;
  }
}
