import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records.js";
import StanzaManager from "./StanzaManager";
import * as event from "../events";

export default class ResultDetailModal {
  #RESULTS_TABLE;
  #ROOT;
  #RESULT_MODAL;
  #EXIT_BUTTON;

  constructor(elm) {
    // make popup element
    this.#ROOT = document.createElement("section");
    this.#ROOT.className = "result-detail-modal";
    document
      .querySelector("body")
      .insertAdjacentElement("beforeend", this.#ROOT);

    // references
    this.#RESULTS_TABLE = document.querySelector("#ResultsTable");
    this.#RESULT_MODAL = document.querySelector(".result-detail-modal");
    this.#EXIT_BUTTON = document.createElement("div");
    this.#EXIT_BUTTON.className = "close-button-view";

    // attach event
    this.#EXIT_BUTTON.addEventListener("click", () => {
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
    if (this.#RESULT_MODAL.innerHTML === "") {
      const keys = e.detail.keys;
      const props = e.detail.properties;
      // TODO getStanzaData
      const stanzas = document.createElement("div");
      stanzas.className = "stanzas";
      stanzas.innerHTML += StanzaManager.draw(keys.subjectId, keys.uniqueEntryId, keys.dataKey);
      
      const container = document.createElement("div");
      container.className = "container";
      container.innerHTML += `      
      <div class="arrow up"></div>
      <div class="arrow right"></div>
      <div class="arrow down"></div>
      <div class="arrow left"></div>
    `;
      container.appendChild(stanzas);
      // SubjectId = Gene (Subject)
      // id = ENSXXXX (Unique-Entry)
      // key = uniprot DB (Togo-key)

      const popup = document.createElement("div");
      popup.className = "popup";
      popup.appendChild(this.#header(keys, props));
      popup.appendChild(container);

      this.#setEventsPopup();
      this.#RESULT_MODAL.appendChild(popup);
      this.#RESULT_MODAL.classList.add("backdrop");
    }
  }

  #header(keys, props) {
    const subject = Records.getSubject(keys.subjectId);
    const isPrimaryKey = props.isPrimaryKey;
    const mainCategory = isPrimaryKey
      ? ""
      : Records.getProperty(keys.mainCategoryId);
    const subCategory = isPrimaryKey
      ? ""
      : Records.getValue(keys.mainCategoryId, keys.subCategoryId);

    const extLink = isPrimaryKey
      ? ""
      : `<a class="external-link" href=${props.externalLink}>External Link`;
    const parentInfo = isPrimaryKey
      ? keys.dataKey
      : `<span style="color: ${subject.colorCCSValue}">${subject.label}　/　${mainCategory.label}</span>`;
    const header = document.createElement("header");
    header.innerHTML = `
      <div>
        <strong>${
          isPrimaryKey ? keys.uniqueEntryId : subCategory.label
        } </strong>
        ${parentInfo}
      </div>
      <div>
        <a class="toreportpage" href="${
          props.reportLink
        }" target="_blank"><span class="material-icons-outlined">open_in_new</span></a>
        ${extLink}
    `;
    header.style.backgroundColor = subject.colorCCSValue;
    header.lastChild.appendChild(this.#EXIT_BUTTON);

    return header;
  }

  #setEventsPopup(){
    // click event for backdrop
    this.#RESULT_MODAL.addEventListener("click", (e) => {
      if (e.target !== e.currentTarget) return;
      this.#hidePopUp();
    });

    document.body.addEventListener("keypress", (e) => {
      if (e.key == "Escape") {
        this.#hidePopUp();
      }
      // TODO add arrow keys
    });
  }
  #hidePopUp() {
    this.#RESULT_MODAL.classList.remove("backdrop");
    this.#RESULT_MODAL.innerHTML = "";
    this.#RESULTS_TABLE
      .querySelectorAll("tr")
      .forEach((tr) => tr.classList.remove("-selected"));
  }
}
