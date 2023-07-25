import ModalWindowView from './ModalWindowView.ts';
import DefaultEventEmitter from './DefaultEventEmitter.ts';
import Records from './Records.ts';
import StanzaManager from './StanzaManager';
import {createPopupEvent} from '../functions/util.ts';
import * as event from '../events';

export default class ResultDetailModal extends ModalWindowView {
  #RESULTS_TABLE;
  #TBODY;
  #handleKeydown;
  #currentTogoKeyView;

  constructor() {
    super();

    this._ROOT.id = 'ResultDetailModal';
    this._HEADER.classList.add('_category-background-color');

    // make arrow buttons
    const makeArrow = direction => {
      const arrow = document.createElement('div');
      arrow.classList.add('arrow', `-${direction.toLowerCase()}`);
      arrow.addEventListener('click', () => this.#move(direction));
      return arrow;
    };
    ['Up', 'Right', 'Down', 'Left'].forEach(direction => {
      this._WINDOW.append(makeArrow(direction));
    });

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

    DefaultEventEmitter.addEventListener(event.hideStanza, () => {
      this._close();
    });
  }

  // bind this on handleKeydown so it will keep listening to same event during the whole popup
  #showStanza(e) {
    this.#currentTogoKeyView = e.detail.togoKeyView;
    const oldTd = this.#TBODY.querySelector('td.-highlighting');
    oldTd?.classList.remove('-highlighting');
    const td = this.#currentTogoKeyView.closest('td');
    td.classList.add('-highlighting');
    // highlight
    this.#currentTogoKeyView.classList.add('-selected');
    const customEvent = new CustomEvent(event.highlightColumn, {
      detail: {
        x: +this.#currentTogoKeyView.dataset.x,
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

    this._ROOT.dataset.categoryId = this.#currentTogoKeyView.dataset.categoryId;
    this.#setHeader(this.#currentTogoKeyView);
    this.#setStanza(this.#currentTogoKeyView);
  }

  #setHeader(togoKeyView) {
    const category = Records.getCategory(togoKeyView.dataset.categoryId);
    const attribute = Records.getAttribute(togoKeyView.dataset.attributeId);
    const isPrimaryKey = togoKeyView.classList.contains('primarykey');
    const categoryLabel = `<span class="category _category-background-color-strong">${
      isPrimaryKey ? togoKeyView.dataset.dataset : category.label
    }</span>`;
    const attributeLable = `<span class="attribute">${
      isPrimaryKey ? togoKeyView.dataset.entry : attribute.label
    }</span>`;
    // for continuous value (distribution), do not output label
    const filter = isPrimaryKey
      ? ''
      : Records.getNode(
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
  }

  #setStanza(togoKeyView) {
    const stanza = document.createElement('div');
    stanza.className = 'stanzas';
    stanza.innerHTML += StanzaManager.draw(
      togoKeyView.dataset.dataset,
      togoKeyView.dataset.entry
    );
    stanza.querySelectorAll('script').forEach(scriptElement => {
      const _script = document.createElement('script');
      _script.textContent = scriptElement.textContent;
      scriptElement.replaceWith(_script);
    });
    this._BODY.append(stanza);
  }

  // Events, functions

  #keydown(e) {
    if (this.#arrowFunctions.has(e.key)) {
      e.preventDefault();
      this._ROOT
        .querySelector(`.arrow.-${e.key.replace('Arrow', '').toLowerCase()}`)
        .click();
    }
  }

  #arrowFunctions = new Map([
    ['ArrowLeft', (x, y) => [x - 1, y]],
    ['ArrowRight', (x, y) => [x + 1, y]],
    ['ArrowUp', (x, y = x) => [x, y - 1]],
    ['ArrowDown', (x, y = x) => [x, y + 1]],
  ]);

  #move(direction) {
    try {
      const targetTogoKeyView = this.#getTargetTogoKeyView(direction);
      targetTogoKeyView.scrollIntoView({block: 'center'});
      createPopupEvent(targetTogoKeyView, event.moveStanza);
    } catch (error) {
      console.error(error, 'Movement out of bounds');
    }
  }

  #getTargetTogoKeyView(direction) {
    const x = +this.#currentTogoKeyView.dataset.x;
    const y = +this.#currentTogoKeyView.dataset.y;
    const y2 = +this.#currentTogoKeyView.dataset.y2;
    const getTargetAxes = this.#arrowFunctions.get('Arrow' + direction);
    // Check if there are multiple entries in the current cell when going up or down
    if (['Down', 'Up'].includes(direction)) {
      const currentTogoKeyViews = this.#getTogoKeysViewByAxes(x, y);
      const targetInternalIndex = getTargetAxes(y2)[1];
      // movement inside cell
      if (currentTogoKeyViews[targetInternalIndex]) {
        return currentTogoKeyViews[targetInternalIndex];
      }
    }
    // default: target outside of current cell
    const [targetX, targetY] = getTargetAxes(x, y);
    const targetTogoKeyViews = this.#getTogoKeysViewByAxes(targetX, targetY);
    const targetIndex = direction === 'Up' ? targetTogoKeyViews.length - 1 : 0;
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
