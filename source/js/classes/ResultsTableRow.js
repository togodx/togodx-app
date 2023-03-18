import {createPopupEvent} from '../functions/util';
import * as event from '../events';

export default class ResultsTableRow {
  #ROOT;

  constructor(index, dataset, header, row) {
    this.#ROOT = document.createElement('tr');
    this.#ROOT.dataset.index = index;
    this.#ROOT.dataset.togoId = row.index.entry;
    this.#ROOT.dataset.entry = row.index.entry;
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
      td.innerHTML = `<div class="inner">
        <ul>
        ${column.items
          .map(
            (item, itemIndex) => `<li>
          <div class="togo-key-view${columnIndex === 0 ? ' primarykey' : ''}"
            data-order="${[columnIndex, index]}"
            data-sub-order="${itemIndex}"
            data-key="${item.dataset}"
            data-subject-id="${
              columnIndex === 0 ? 'primary' : header[columnIndex - 1].categoryId
            }"
            ${
              columnIndex === 0
                ? ''
                : `data-main-category-id="${
                    header[columnIndex - 1].attributeId
                  }" data-sub-category-id="${item.node}"`
            }
            data-unique-entry-id="${item.entry}"
            >${item.entry}</div>
          <span>${item.label}</span>
          </li>`
          )
          .join('')}
        </ul>
      </div>`;

      // naming needs improvement but hierarcy for Popup screen is like below
      td.querySelectorAll('.togo-key-view').forEach(togoKeyView => {
        togoKeyView.addEventListener('click', () => {
          createPopupEvent(togoKeyView, event.showPopup);
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
