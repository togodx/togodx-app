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
      this.#handleKeydown = this.#handleKeydown.bind(this);
      document.addEventListener('keydown', this.#handleKeydown);
      this.#RESULT_MODAL.appendChild(this.#popup(e.detail));
      this.#RESULT_MODAL.classList.add("backdrop");
    }
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
      this.#setMovementArrow(this.#arrowFuncs.get("Arrow" + direction), e.detail);
    }
  }

  #arrowFuncs = new Map([
    ["ArrowLeft", function(x,y){return [x-1, y]}],
    ["ArrowRight", function(x,y){return [x+1, y]}],
    ["ArrowUp", function(x,y){return [x, y-1]}],
    ["ArrowDown", function(x,y){return [x, y+1]}]
  ]);

  #setMovementArrow(movement, detail) {
    detail.properties.movement = movement;
    const curEntry = this.#RESULTS_TABLE.querySelector(`[data-unique-entry-id = "${detail.keys.uniqueEntryId}"]`)
    let [x,y] = curEntry.getAttribute("data-order").split(",");
    [x,y] = [x,y].map((cor) => parseFloat(cor));
    
    const targetEntry = this.#RESULTS_TABLE.querySelector(`[data-order = "${movement(x,y)}"`);
    targetEntry.classList.add("-selected");

    const targetTr = targetEntry.closest('tr');
    const reportLink = "test";

    ResultsTable.prototype.createPopupEvent(targetEntry, targetTr, reportLink, event.movePopup);
    // const customEvent = new CustomEvent(event.movePopup, {
    //   detail: detail
    // });
    // DefaultEventEmitter.dispatchEvent(customEvent);
  }

  #moveWithArrow(keys, props) {
    //TODO: Implement functions for data with multiple entries
    console.log("moving!");
      // const curTr = this.#RESULTS_TABLE.querySelector(".-selected");
      const uniqueId = this.#RESULTS_TABLE.querySelector(`[data-unique-entry-id = "${keys.uniqueEntryId}"]`)
      // let [x,y] = curEntry.getAttribute("data-order").split(",");
      // [x,y] = [x,y].map((cor) => parseFloat(cor));
    
      // const targetEntry = this.#RESULTS_TABLE.querySelector(`[data-order = "${movement(x,y)}"`);
      uniqueId.classList.add("-selected");
      // curEntry.classList.remove("-selected");

      // const test= this.#RESULT_MODAL.querySelector('header');
      // test.remove();
      // this.#RESULT_MODAL.prepend(this.#header(keys, props));
      // this.#RESULT_MODAL.querySelector(".stanzas").innerHTML = StanzaManager.draw(
      //   keys.subjectId,
      //   keys.uniqueEntryId,
      //   keys.dataKey
      // );
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
