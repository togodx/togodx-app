import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import StanzaManager from './StanzaManager';
import {createPopupEvent} from '../functions/util';
import * as event from '../events';

export default class ResultDetailModal {
  #ROOT;
  #RESULTS_TABLE;
  #RESULT_MODAL;
  #exit_button;

  constructor() {
    this.#ROOT = document.createElement('section');
    this.#ROOT.id = 'ResultDetailModal';
    document
      .querySelector('body')
      .insertAdjacentElement('beforeend', this.#ROOT);

    // references
    this.#RESULTS_TABLE = document.querySelector('#ResultsTable');
    this.#RESULT_MODAL = document.querySelector('#ResultDetailModal');
    this.#exit_button = document.createElement('div');
    this.#exit_button.className = 'close-button-view';

    // attach event
    this.#exit_button.addEventListener('click', () => {
      this.#hidePopUp();
    });

    DefaultEventEmitter.addEventListener(event.showPopup, e => {
      this.#showPopUp(e);
    });

    DefaultEventEmitter.addEventListener(event.movePopup, e => {
      this.#hidePopUp();
      this.#showPopUp(e);
    });

    DefaultEventEmitter.addEventListener(event.hidePopUp, () => {
      this.#hidePopUp();
    });

    this.#RESULT_MODAL.addEventListener('click', e => {
      if (e.target !== e.currentTarget) return;
      this.#hidePopUp();
    });
  }

  // bind this on handleKeydown so it will keep listening to same event during the whole popup
  #showPopUp(e) {
    if (this.#RESULT_MODAL.innerHTML === '') {
      this.#setHighlight(
        e.detail.properties.dataOrder,
        e.detail.properties.dataSubOrder
      );
      this.#handleKeydown = this.#handleKeydown.bind(this);
      document.addEventListener('keydown', this.#handleKeydown);

      this.#RESULT_MODAL.appendChild(this.#popup(e.detail));
      this.#RESULT_MODAL.classList.add('backdrop');
    }
  }
  // HTML elements
  #popup(detail) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.appendChild(this.#header(detail.keys, detail.properties));
    popup.appendChild(this.#container(detail.keys, detail.properties));

    return popup;
  }

  #header(keys, props) {
    const subject = Records.getSubject(keys.subjectId);
    const isPrimaryKey = props.isPrimaryKey;
    const mainCategory = isPrimaryKey
      ? ''
      : Records.getProperty(keys.mainCategoryId);
    const subCategory = isPrimaryKey
      ? ''
      : Records.getValue(keys.mainCategoryId, keys.subCategoryId);
    const path = isPrimaryKey
      ? keys.dataKey
      : `<span class='path'>${subject.subject} / ${subCategory.label}</span>`;
    const header = document.createElement('header');
    header.innerHTML = `
      <div class='label'>
        <strong>${
          isPrimaryKey ? keys.uniqueEntryId : mainCategory.label
        } </strong>
        ${path}
      </div>
      <div>
        <a class='report-page-button-view' href='${
          props.reportLink
        }' target='_blank'><span class='material-icons-outlined'>open_in_new</span></a>
    `;
    header.style.backgroundColor = subject.colorCSSValue;
    header.lastChild.appendChild(this.#exit_button);

    return header;
  }

  #container(keys, props) {
    const container = document.createElement('div');
    container.className = 'container';
    ['Up', 'Right', 'Down', 'Left'].forEach(direction => {
      container.appendChild(this.#arrow(direction, props));
    });
    container.appendChild(
      this.#stanzas(keys.subjectId, keys.uniqueEntryId, keys.dataKey)
    );

    return container;
  }

  #stanzas(subjectId, uniqueEntryId, dataKey) {
    const stanzas = document.createElement('div');
    stanzas.className = 'stanzas';
    stanzas.innerHTML += StanzaManager.draw(subjectId, uniqueEntryId, dataKey);

    return stanzas;
  }

  #arrow(direction, props) {
    const arrow = document.createElement('div');
    arrow.classList.add('arrow', `-${direction.toLowerCase()}`);
    arrow.addEventListener('click', e => {
      this.#setMovementArrow(direction, props.dataOrder, props.dataSubOrder);
    });

    return arrow;
  }

  // Events, functions
  #setHighlight(axes, subOrder) {
    const curEntry = !subOrder
      ? this.#RESULTS_TABLE.querySelector(`[data-order = '${axes}']`)
      : this.#RESULTS_TABLE.querySelector(
          `[data-order = '${axes}'][data-sub-order = '${subOrder}']`
        );

    const curTr = curEntry.closest('tr');
    curEntry.classList.add('-selected');
    curTr.classList.add('-selected');

    const customEvent = new CustomEvent(event.highlightCol, {
      detail: axes,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  #handleKeydown = e => {
    if (e.key == 'Escape') {
      this.#hidePopUp();
    } else if (this.#arrowFuncs.has(e.key)) {
      this.#RESULT_MODAL
        .querySelector(`.arrow.-${e.key.replace('Arrow', '').toLowerCase()}`)
        .click();
    }
  };

  #arrowFuncs = new Map([
    [
      'ArrowLeft',
      function (x, y) {
        return [x - 1, y];
      },
    ],
    [
      'ArrowRight',
      function (x, y) {
        return [x + 1, y];
      },
    ],
    [
      'ArrowUp',
      function (x, y) {
        return [x, y - 1];
      },
    ],
    [
      'ArrowDown',
      function (x, y) {
        return [x, y + 1];
      },
    ],
  ]);

  #getCorList(str) {
    let [x, y] = str.split(',');
    return [x, y].map(cor => parseInt(cor));
  }

  #setMovementArrow(direction, axes, internalIndex) {
    //TODO: Implement functions for data with multiple entries
    const targetEntry = this.#getTargetEntry(
      direction,
      axes,
      parseInt(internalIndex)
    );
    const targetTr = targetEntry.closest('tr');
    const reportLink = targetTr.querySelector(
      ':scope > th > .inner > .report-page-button-view'
    ).href;

    createPopupEvent(targetEntry, reportLink, event.movePopup);
  }

  #getTargetEntry(direction, axes, internalIndex) {
    // Check if there are multiple entries in the cell
    if (['Down', 'Up'].includes(direction)) {
      const allCurEntries = this.#RESULTS_TABLE.querySelectorAll(
        `[data-order = '${axes}']`
      );
      const targetIndex = direction === 'Down' ? internalIndex + 1 : internalIndex - 1;
      // if (targetIndex === -1) {
      //   let [x, y] = this.#getCorList(axes);
      //   const movement = this.#arrowFuncs.get('Arrow' + direction);
      //   const allTargetEntires = this.#RESULTS_TABLE.querySelectorAll(
      //     `[data-order = '${movement(x, y)}']`
      //   );
      //   return allTargetEntires[allTargetEntires.length - 1];
      // }
      // movement inside cell
      if(allCurEntries[targetIndex]){
          return allCurEntries[targetIndex];
      }

    }
    // default target outside of cell
    let [x, y] = this.#getCorList(axes);
    const movement = this.#arrowFuncs.get('Arrow' + direction);
    const allTargetEntires = this.#RESULTS_TABLE.querySelectorAll(
      `[data-order = '${movement(x, y)}']`
    );
    return allTargetEntires[0];
  }

  #hidePopUp() {
    this.#RESULT_MODAL.classList.remove('backdrop');
    this.#RESULT_MODAL.innerHTML = '';
    this.#RESULTS_TABLE
      .querySelectorAll('.-selected')
      .forEach(entry => entry.classList.remove('-selected'));
    document.removeEventListener('keydown', this.#handleKeydown);
  }
}
