import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import StanzaManager from "./StanzaManager";
import ResultsTable from "./ResultsTable";
import * as event from "../events";

export default class ResultDetailModal {
  #RESULTS_TABLE;
  #ROOT;
  #RESULT_MODAL;
  #EXIT_BUTTON;

  constructor(elm) {
    this.#ROOT = document.createElement('section');
    this.#ROOT.id = "ResultDetailModal";
    document
      .querySelector('body')
      .insertAdjacentElement("beforeend", this.#ROOT);

    // references
    this.#RESULTS_TABLE = document.querySelector("#ResultsTable");
    this.#RESULT_MODAL = document.querySelector("#ResultDetailModal");
    this.#EXIT_BUTTON = document.createElement('div');
    this.#EXIT_BUTTON.className = "close-button-view";

    // attach event
    this.#EXIT_BUTTON.addEventListener('click', () => {
      this.#hidePopUp();
    });

    DefaultEventEmitter.addEventListener(event.showPopup, (e) => {
      this.#showPopUp(e);
    });

    DefaultEventEmitter.addEventListener(event.movePopup, (e) => {
      this.#hidePopUp();
      this.#showPopUp(e);
    });

    DefaultEventEmitter.addEventListener(event.hidePopUp, () => {
      this.#hidePopUp();
    });

    this.#RESULT_MODAL.addEventListener('click', (e) => {
      if (e.target !== e.currentTarget) return;
      this.#hidePopUp();
    });

  }

  #showPopUp(e) {
    if (this.#RESULT_MODAL.innerHTML === '') {
      this.#setHighlight(e.detail.keys.uniqueEntryId, e.detail.properties.dataOrder);
      this.#handleKeydown = this.#handleKeydown.bind(this);
      document.addEventListener('keydown', this.#handleKeydown);
      this.#RESULT_MODAL.appendChild(this.#popup(e.detail));
      this.#RESULT_MODAL.classList.add("backdrop");
    }
  }
  //TODO: hover highlighting 
  #setHighlight(id, axes) {
    const curEntry = this.#entryEl(id);
    const curTr = curEntry.closest('tr');
    curEntry.classList.add('-selected');
    curTr.classList.add('-selected');

    const rowIndex = axes.slice(0,1);
    this.#RESULTS_TABLE.querySelectorAll('[data-order]').forEach(element => {
      const td = element.closest('td');
      if(element.getAttribute('data-order').slice(0,1) === rowIndex){
        td.classList.add('-selected');
      }
    });
  }

  #entryEl(id) {
    return this.#RESULTS_TABLE.querySelector(`[data-unique-entry-id = "${id}"]`);
  }

  #popup(detail) {
    const popup = document.createElement('div');
      popup.className = "popup";
      popup.appendChild(this.#header(detail.keys, detail.properties));
      popup.appendChild(this.#container(detail));
    
      return popup
  }
  // HTML elements
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
      : `<span class="path">${subject.subject}　/　${subCategory.label}</span>`;
    const header = document.createElement("header");
    header.innerHTML = `
      <div class="label">
        <strong>${
          isPrimaryKey ? keys.uniqueEntryId : mainCategory.label
        } </strong>
        ${path}
      </div>
      <div>
        <a class="toreportpage" href="${
          props.reportLink
        }" target="_blank"><span class="material-icons-outlined">open_in_new</span></a>
    `;
    header.style.backgroundColor = subject.colorCSSValue;
    header.lastChild.appendChild(this.#EXIT_BUTTON);

    return header;
  }

  #container(detail){
    const container = document.createElement('div');
    container.className = "container";
    ["Up", "Right", "Down", "Left"].forEach((dir) => {
      container.appendChild(this.#arrow(dir, detail));
    });
    container.appendChild(this.#stanzas(detail.keys));

    return container
  }

  #stanzas(keys) {
    const stanzas = document.createElement('div');
    stanzas.className = "stanzas";
    stanzas.innerHTML += StanzaManager.draw(
      keys.subjectId,
      keys.uniqueEntryId,
      keys.dataKey
    );

    return stanzas
  }

  #arrow(direction, detail) {
    const arrow = document.createElement('div');
    arrow.classList.add("arrow", `-${direction.toLowerCase()}`);
    arrow.addEventListener('click', (e) => {
      this.#setMovementArrow(this.#arrowFuncs.get("Arrow" + direction), detail);
    });

    return arrow;
  }

  // Events, functions
  #handleKeydown = (e) => {
    if(e.key == "Escape"){
      this.#hidePopUp();
    }
    else if (this.#arrowFuncs.has(e.key)){
      // TODO: set actual event handler
      this.#RESULT_MODAL.querySelector(`.arrow.-${e.key.replace('Arrow','').toLowerCase()}`).click();
    }
  }

  #arrowFuncs = new Map([
    ["ArrowLeft", function(x,y){return [x-1, y]}],
    ["ArrowRight", function(x,y){return [x+1, y]}],
    ["ArrowUp", function(x,y){return [x, y-1]}],
    ["ArrowDown", function(x,y){return [x, y+1]}]
  ]);

  #getCorList(str) {
    let [x,y] = str.split(",");
    return [x,y].map((cor) => parseFloat(cor));
  }

  #setMovementArrow(movement, detail) {
    //TODO: Implement functions for data with multiple entries
    detail.properties.movement = movement;
    const curEntry = this.#entryEl(detail.keys.uniqueEntryId);
    let [x, y] = this.#getCorList(curEntry.getAttribute("data-order"));
    
    const targetEntry = this.#RESULTS_TABLE.querySelector(`[data-order = "${movement(x,y)}"`);
    const targetTr = targetEntry.closest('tr');
    const reportLink = targetTr.querySelector('.toreportpage').href;

    ResultsTable.prototype.createPopupEvent(targetEntry, targetTr, reportLink, event.movePopup);
  }

  #hidePopUp() {
    this.#RESULT_MODAL.classList.remove("backdrop");
    this.#RESULT_MODAL.innerHTML = '';
    this.#RESULTS_TABLE
      .querySelectorAll(".-selected")
      .forEach((entry) => entry.classList.remove("-selected"));
    document.removeEventListener('keydown', this.#handleKeydown);
  }
}
