import ModalWindowView from './ModalWindowView';
import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import StanzaManager from './StanzaManager';
import {createPopupEvent} from '../functions/util';
import {dragView} from '../functions/dragView';
import * as event from '../events';

export default class ResultDetailModal extends ModalWindowView {
  // #ROOT;
  #RESULTS_TABLE;
  #TBODY;
  #handleKeydown;

  constructor() {
    super();

    this._ROOT.id = 'ResultDetailModal';
    this._HEADER.classList.add('_category-background-color');

    // references
    this.#RESULTS_TABLE = document.querySelector('#ResultsTable');
    this.#TBODY = this.#RESULTS_TABLE.querySelector('tbody');

    // attach event
    DefaultEventEmitter.addEventListener(event.showStanza, e => {
      this.#showStanza(e);
    });

    DefaultEventEmitter.addEventListener(event.moveStanza, e => {
      this._close(false);
      this.#showStanza(e);
    });

    DefaultEventEmitter.addEventListener(event.dragElement, e => {
      dragView(e.detail);
    });

    DefaultEventEmitter.addEventListener(event.hideStanza, () => {
      this._close();
    });

    this._ROOT.addEventListener('click', e => {
      if (e.target !== e.currentTarget) return;
      DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));
    });
  }

  // bind this on handleKeydown so it will keep listening to same event during the whole popup
  #showStanza(e) {
    const togoKeyView = e.detail.togoKeyView;
    const oldTd = this.#TBODY.querySelector('td.-highlighting');
    oldTd?.classList.remove('-highlighting');
    const td = togoKeyView.closest('td');
    td.classList.add('-highlighting');
    // highlight
    togoKeyView.classList.add('-selected');
    const customEvent = new CustomEvent(event.highlightColumn, {
      detail: {
        x: +togoKeyView.dataset.x,
        isEnter: true,
        oldCell: {
          x: +oldTd.dataset.x,
          y: +oldTd.dataset.y,
        },
        newCell: {
          x: +td.dataset.x,
          y: +td.dataset.y,
        },
      },
    });
    DefaultEventEmitter.dispatchEvent(customEvent);

    this._open();

    // key event
    this.#handleKeydown = this.#keydown.bind(this);
    document.addEventListener('keydown', this.#handleKeydown);

    const modalWindow = this._getWindow();
    this._ROOT.dataset.categoryId = e.detail.togoKeyView.dataset.categoryId;
    modalWindow.appendChild(this.#header(e.detail.togoKeyView));
    modalWindow.appendChild(this.#container(e.detail.togoKeyView));
    this._ROOT.classList.add('-opened');
  }

  #header(togoKeyView) {
    const category = Records.getCategory(togoKeyView.dataset.categoryId);
    const attribute = Records.getAttribute(togoKeyView.dataset.attributeId);
    const isPrimaryKey = togoKeyView.classList.contains('primarykey');
    const categoryLabel = isPrimaryKey
      ? `<span class="category _category-background-color-strong">${togoKeyView.dataset.dataset}</span>`
      : `<span class="category _category-background-color-strong">${category.label}</span>`;
    const attributeLable = `<span class="attribute">${
      isPrimaryKey ? togoKeyView.dataset.entry : attribute.label
    }</span>`;
    // for continuous value (distribution), do not output label
    const filter = isPrimaryKey
      ? ''
      : Records.getFilter(
          togoKeyView.dataset.attributeId,
          togoKeyView.dataset.node
        );
    const valueLabel =
      attribute?.datamodel !== 'distribution' && filter?.label
        ? `<span class="value">${filter.label}</span>`
        : '';
    this._TITLE.innerHTML = `
        ${categoryLabel}
        ${attributeLable}
        ${valueLabel}
    `;
    // header.lastElementChild.appendChild(this.#EXIT_BUTTON);
    // header.addEventListener('mousedown', e => {
    //   const customEvent = new CustomEvent(event.dragElement, {
    //     detail: {
    //       x: e.clientX,
    //       y: e.clientY,
    //       container: header.parentElement,
    //       dragableElement: header,
    //     },
    //   });
    //   DefaultEventEmitter.dispatchEvent(customEvent);
    // });

    return this._HEADER;
  }

  #container(togoKeyView) {
    ['Up', 'Right', 'Down', 'Left'].forEach(direction => {
      this._BODY.appendChild(this.#arrow(direction, togoKeyView));
    });
    this._BODY.appendChild(
      this.#stanzas(togoKeyView.dataset.entry, togoKeyView.dataset.dataset)
    );
    return this._BODY;
  }

  #stanzas(entry, dataset) {
    const stanzas = document.createElement('div');
    stanzas.className = 'stanzas';
    stanzas.innerHTML += StanzaManager.draw(dataset, entry);
    stanzas.querySelectorAll('script').forEach(scriptElement => {
      const _script = document.createElement('script');
      _script.textContent = scriptElement.textContent;
      scriptElement.replaceWith(_script);
    });
    return stanzas;
  }

  #arrow(direction, togoKeyView) {
    const arrow = document.createElement('div');
    arrow.classList.add('arrow', `-${direction.toLowerCase()}`);
    arrow.addEventListener('click', () => {
      const arrowMovement = {
        dir: direction,
        curX: parseInt(togoKeyView.dataset.x),
        curY: parseInt(togoKeyView.dataset.y),
        curInternalIndex: parseInt(togoKeyView.dataset.y2),
        getTargetAxes: this.#arrowFuncs.get('Arrow' + direction),
      };
      this.#setMovementArrow(arrowMovement);
    });
    return arrow;
  }

  // Events, functions

  #keydown(e) {
    if (this.#arrowFuncs.has(e.key)) {
      e.preventDefault();
      this._ROOT
        .querySelector(`.arrow.-${e.key.replace('Arrow', '').toLowerCase()}`)
        .click();
    }
  }

  #arrowFuncs = new Map([
    ['ArrowLeft', (x, y) => [x - 1, y]],
    ['ArrowRight', (x, y) => [x + 1, y]],
    ['ArrowUp', (x, y = x) => [x, y - 1]],
    ['ArrowDown', (x, y = x) => [x, y + 1]],
  ]);

  #setMovementArrow(movement) {
    try {
      const targetTogoKeyView = this.#getTargetTogoKeyView(movement);
      targetTogoKeyView.scrollIntoView({block: 'center'});
      createPopupEvent(targetTogoKeyView, event.moveStanza);
    } catch (error) {
      console.error('Movement out of bounds');
    }
  }

  #getTargetTogoKeyView(move) {
    // Check if there are multiple entries in the current cell when going up or down
    if (['Down', 'Up'].includes(move.dir)) {
      const currentTogoKeyViews = this.#getTogoKeysViewByAxes(
        move.curX,
        move.curY
      );
      const targetInternalIndex = move.getTargetAxes(move.curInternalIndex)[1];
      // movement inside cell
      if (currentTogoKeyViews[targetInternalIndex]) {
        return currentTogoKeyViews[targetInternalIndex];
      }
    }
    // default: target outside of current cell
    const [targetX, targetY] = move.getTargetAxes(move.curX, move.curY);
    const targetTogoKeyViews = this.#getTogoKeysViewByAxes(targetX, targetY);
    const targetIndex = move.dir === 'Up' ? targetTogoKeyViews.length - 1 : 0;
    return targetTogoKeyViews[targetIndex];
  }

  #getTogoKeysViewByAxes(x, y) {
    return this.#RESULTS_TABLE.querySelectorAll(
      `.togo-key-view[data-x='${x}'][data-y='${y}']`
    );
  }

  _close(exitingPopup = true) {
    super._close(exitingPopup);
    this.#RESULTS_TABLE
      .querySelectorAll('.togo-key-view.-selected')
      .forEach(entry => entry.classList.remove('-selected'));
    document.removeEventListener('keydown', this.#handleKeydown);
  }
}
