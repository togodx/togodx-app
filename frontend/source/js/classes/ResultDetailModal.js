import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import StanzaManager from "./StanzaManager";
import * as event from "../events";

export default class ResultDetailModal {
  #arrow_dirs;
  #RESULTS_TABLE;
  #ROOT;
  #RESULT_MODAL;
  #EXIT_BUTTON;

  constructor(elm) {
    // make popup element
    this.#ROOT = document.createElement('section');
    this.#ROOT.className = "result-detail-modal";
    document
      .querySelector('body')
      .insertAdjacentElement("beforeend", this.#ROOT);

    // references
    this.#RESULTS_TABLE = document.querySelector("#ResultsTable");
    this.#RESULT_MODAL = document.querySelector(".result-detail-modal");
    this.#EXIT_BUTTON = document.createElement('div');
    this.#EXIT_BUTTON.className = "close-button-view";
    this.#arrow_dirs = ["up", "right", "down", "left"];

    // attach event
    this.#EXIT_BUTTON.addEventListener('click', () => {
      this.#hidePopUp();
    });

    DefaultEventEmitter.addEventListener(event.showPopup, (e) => {
      this.#showPopUp(e);
    });

    DefaultEventEmitter.addEventListener(event.hidePopup, (e) => {
      this.#hidePopUp();
    });
  }

  // private methods
  #showPopUp(e) {
    if (this.#RESULT_MODAL.innerHTML === '') {
      const popup = document.createElement('div');
      popup.className = "popup";
      popup.appendChild(this.#header(e.detail.keys, e.detail.properties));
      popup.appendChild(this.#container(e.detail.keys));

      this.#setEventsPopup();
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

    const extLink = isPrimaryKey
      ? ''
      : `<a class="external-link" href=${props.externalLink}>External Link`;
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
        ${extLink}
    `;
    header.style.backgroundColor = subject.colorCSSValue;
    header.lastChild.appendChild(this.#EXIT_BUTTON);

    return header;
  }

  #arrow(direction) {
    const arrow = document.createElement('div');
    arrow.classList.add("arrow", `-${direction}`);
    arrow.addEventListener('click', (e) => {
      alert(direction + " arrow clicked!");
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
    this.#arrow_dirs.forEach((dir) => {
      container.appendChild(this.#arrow(dir));
    });
    container.appendChild(this.#stanzas(keys));

    return container
  }

  // Events, functions
  #setEventsPopup() {
    // click event for backdrop
    this.#RESULT_MODAL.addEventListener('click', (e) => {
      if (e.target !== e.currentTarget) return;
      this.#hidePopUp();
    });

    this.#RESULT_MODAL.addEventListener("keypress", (e) => {
      console.log("pressed a key!");
      if(e.key == 'Escape'){
        this.#hidePopUp();
      };

      switch (e.key) {
        case "Escape":
          this.#hidePopUp();
        case "ArrowUp":
          alert("arrow up!");
      }
      // TODO: add keyboard arrows
    });
  }

  #hidePopUp() {
    this.#RESULT_MODAL.classList.remove("backdrop");
    this.#RESULT_MODAL.innerHTML = '';
    this.#RESULTS_TABLE
      .querySelectorAll("tr")
      .forEach((tr) => tr.classList.remove("-selected"));
  }
}
