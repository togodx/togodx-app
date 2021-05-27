import DefaultEventEmitter from './DefaultEventEmitter';
import Records from "./Records";
import StanzaManager from "./StanzaManager";
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
      const popup = document.createElement('div');
      popup.className = "popup";
      popup.appendChild(this.#header(e.detail.keys, e.detail.properties));
      popup.appendChild(this.#container(e.detail.keys));

      this.#handleKeydown = this.#handleKeydown.bind(this);
      document.addEventListener('keydown', this.#handleKeydown);
      this.#RESULT_MODAL.appendChild(popup);
      this.#RESULT_MODAL.classList.add("backdrop");
    }
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

  #arrow(direction) {
    const arrow = document.createElement('div');
    arrow.classList.add("arrow", `-${direction.toLowerCase()}`);
    arrow.addEventListener('click', (e) => {
      this.#moveWithArrow(this.#arrowFuncs.get("Arrow" + direction));
    });

    return arrow;
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

  #container(keys){
    const container = document.createElement('div');
    container.className = "container";
    ["Up", "Right", "Down", "Left"].forEach((dir) => {
      container.appendChild(this.#arrow(dir));
    });
    container.appendChild(this.#stanzas(keys));

    return container
  }

  // Events, functions
  #handleKeydown = (e) => {
    if(e.key == "Escape"){
      this.#hidePopUp();
    }
    else if (this.#arrowFuncs.has(e.key)){
      this.#moveWithArrow(this.#arrowFuncs.get(e.key));
    }
  }

  #arrowFuncs = new Map([
    ["ArrowLeft", function(x,y){return [x-1, y]}],
    ["ArrowRight", function(x,y){return [x+1, y]}],
    ["ArrowUp", function(x,y){return [x, y-1]}],
    ["ArrowDown", function(x,y){return [x, y+1]}]
  ]);

  #moveWithArrow(movement) {
    //TODO: Implement functions for data with multiple entries
    try {
      const curEntry = this.#RESULTS_TABLE.querySelector(".-selected");
      let [x,y] = curEntry.getAttribute("data-order").split(",");
      [x,y] = [x,y].map((cor) => parseFloat(cor));
    
      const targetEntry = this.#RESULTS_TABLE.querySelector(`[data-order = "${movement(x,y)}"`);
      targetEntry.classList.add("-selected");
      curEntry.classList.remove("-selected");

      this.#RESULT_MODAL.querySelector(".stanzas").innerHTML = StanzaManager.draw(
        targetEntry.getAttribute("data-subject-id"),
        targetEntry.getAttribute("data-unique-entry-id"),
        targetEntry.getAttribute("data-key")
    );
      
    } catch (error) {
      console.log("reached end of table!");
    }
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
