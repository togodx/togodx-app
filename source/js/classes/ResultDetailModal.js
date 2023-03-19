import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import StanzaManager from './StanzaManager';
import {createPopupEvent} from '../functions/util';
import {dragView} from '../functions/dragView';
import * as event from '../events';

export default class ResultDetailModal {
  #ROOT;
  #RESULTS_TABLE;
  #RESULT_MODAL;
  #EXIT_BUTTON;
  #popupPosition;
  #popup_top;
  #popup_left;
  #handleKeydown;

  constructor() {
    this.#ROOT = document.createElement('section');
    this.#ROOT.id = 'ResultDetailModal';
    document
      .querySelector('body')
      .insertAdjacentElement('beforeend', this.#ROOT);

    // references
    this.#RESULTS_TABLE = document.querySelector('#ResultsView');
    this.#RESULT_MODAL = document.querySelector('#ResultDetailModal');
    this.#EXIT_BUTTON = document.createElement('div');
    this.#EXIT_BUTTON.className = 'close-button-view';

    this.#popupPosition = {x: 0, y: 0};

    // attach event
    DefaultEventEmitter.addEventListener(event.showStanza, e => {
      this.#showStanza(e);
    });

    DefaultEventEmitter.addEventListener(event.moveStanza, e => {
      this.#hideStanza(false);
      this.#showStanza(e);
    });

    DefaultEventEmitter.addEventListener(event.dragElement, e => {
      dragView(e.detail);
    });

    DefaultEventEmitter.addEventListener(event.hideStanza, () => {
      this.#hideStanza();
    });

    this.#RESULT_MODAL.addEventListener('click', e => {
      if (e.target !== e.currentTarget) return;
      DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));
    });

    this.#EXIT_BUTTON.addEventListener('click', () => {
      DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));
    });
  }

  // bind this on handleKeydown so it will keep listening to same event during the whole popup
  #showStanza(e) {
    const togoKeyView = e.detail.togoKeyView;
    // highlight
    const tr = togoKeyView.closest('tr');
    togoKeyView.classList.add('-selected');
    tr.classList.add('-selected');
    const customEvent = new CustomEvent(event.highlightColumn, {
      detail: {
        x: +togoKeyView.dataset.x,
        isEnter: true,
      },
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
    // key event
    this.#handleKeydown = this.#keydown.bind(this);
    document.addEventListener('keydown', this.#handleKeydown);

    this.#RESULT_MODAL.appendChild(this.#popup(e.detail));
    this.#RESULT_MODAL.classList.add('backdrop');
  }

  // HTML elements
  #popup(detail) {
    this.#ROOT.dataset.categoryId = detail.togoKeyView.dataset.categoryId;
    const popup = document.createElement('div');
    popup.className = 'popup';
    console.log(this.#popup_left, this.#popup_top);
    popup.style.left = this.#popup_left;
    popup.style.top = this.#popup_top;
    popup.appendChild(this.#header(detail.togoKeyView));
    popup.appendChild(this.#container(detail.togoKeyView));
    return popup;
  }

  #header(togoKeyView) {
    const category = Records.getCategory(togoKeyView.dataset.categoryId);
    const attribute = Records.getAttribute(togoKeyView.dataset.attributeId);
    const isPrimaryKey = togoKeyView.classList.contains('primarykey');
    const categoryLabel = isPrimaryKey
      ? togoKeyView.dataset.dataset
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
    const header = document.createElement('header');
    header.innerHTML = `
      <div class="label">
        ${categoryLabel}
        ${attributeLable}
        ${valueLabel}
      </div>
      <div/>
    `;
    header.classList.add('_category-background-color');
    header.lastElementChild.appendChild(this.#EXIT_BUTTON);
    header.addEventListener('mousedown', e => {
      const customEvent = new CustomEvent(event.dragElement, {
        detail: {
          x: e.clientX,
          y: e.clientY,
          container: header.parentElement,
          dragableElement: header,
        },
      });
      DefaultEventEmitter.dispatchEvent(customEvent);
    });

    return header;
  }

  #container(togoKeyView) {
    const container = document.createElement('div');
    container.className = 'container';
    ['Up', 'Right', 'Down', 'Left'].forEach(direction => {
      container.appendChild(this.#arrow(direction, togoKeyView));
    });
    container.appendChild(
      this.#stanzas(togoKeyView.dataset.entry, togoKeyView.dataset.dataset)
    );
    return container;
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
    if (e.key == 'Escape') {
      DefaultEventEmitter.dispatchEvent(new CustomEvent(event.hideStanza));
    } else if (this.#arrowFuncs.has(e.key)) {
      e.preventDefault();
      this.#RESULT_MODAL
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
      const targetEntry = this.#getTargetEntry(movement);

      targetEntry.scrollIntoView({block: 'center'});
      createPopupEvent(targetEntry, event.moveStanza);
    } catch (error) {
      console.error('Movement out of bounds');
    }
  }

  #getTargetEntry(move) {
    // Check if there are multiple entries in the current cell when going up or down
    if (['Down', 'Up'].includes(move.dir)) {
      const allCurEntries = this.#getTogoKeysViewByAxes(move.curX, move.curY);
      const targetInternalIndex = move.getTargetAxes(move.curInternalIndex)[1];
      // movement inside cell
      if (allCurEntries[targetInternalIndex]) {
        return allCurEntries[targetInternalIndex];
      }
    }
    // default: target outside of current cell
    const [targetX, targetY] = move.getTargetAxes(move.curX, move.curY);
    const allTargetEntries = this.#getTogoKeysViewByAxes(targetX, targetY);
    const targetIndex = move.dir === 'Up' ? allTargetEntries.length - 1 : 0;

    return allTargetEntries[targetIndex];
  }

  #getTogoKeysViewByAxes(x, y) {
    return this.#RESULTS_TABLE.querySelectorAll(
      `.togo-key-view[data-x='${x}'][data-y='${y}']`
    );
  }
  #getTogoKeyViewByAxes(x, y, y2) {
    return this.#RESULTS_TABLE.querySelector(
      `.togo-key-view[data-x='${x}'][data-y='${y}'][data-y2='${y2}']`
    );
  }

  #hideStanza(exitingPopup = true) {
    // reset popup to the center if it is shown for first time
    // keep moved axes if user has dragged popup while moving with arrows
    const popupStyle = this.#RESULT_MODAL.querySelector('.popup').style;
    this.#popup_top = exitingPopup ? '' : popupStyle.top;
    this.#popup_left = exitingPopup ? '' : popupStyle.left;

    this.#RESULT_MODAL.classList.remove('backdrop');
    this.#RESULT_MODAL.innerHTML = '';
    this.#RESULTS_TABLE
      .querySelectorAll('.-selected')
      .forEach(entry => entry.classList.remove('-selected'));
    document.removeEventListener('keydown', this.#handleKeydown);
  }
}
