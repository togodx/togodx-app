import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records.js";
import * as event from "../events";

export default class ReportsView {
  #templates;
  #BODY;
  #ROOT;
  #REPORT_MODAL;
  #EXIT_BUTTON;

  constructor(elm) {
    // make popup element
    this.#ROOT = document.createElement("section");
    this.#ROOT.className = "report-modal";
    document
      .querySelector("body")
      .insertAdjacentElement("beforeend", this.#ROOT);

    // references
    this._stanzas = {};
    this.#BODY = document.querySelector("body");
    this.#REPORT_MODAL = document.querySelector(".report-modal");
    this.#EXIT_BUTTON = document.createElement("div");
    this.#EXIT_BUTTON.className = "close-button";
    const returnButton = elm.querySelector(":scope > footer > button.return");

    // attach event
    returnButton.addEventListener("click", () => {
      this.#BODY.dataset.display = "properties";
    });

    this.#EXIT_BUTTON.addEventListener("click", () => {
      this.#hidePopUp();
    });

    // event listener
    DefaultEventEmitter.addEventListener(event.showStanza, (e) => {
      this.#showPopUp(e.detail.subject, e.detail.properties);
    });
    DefaultEventEmitter.addEventListener(event.hideStanza, (e) => {
      this.#hidePopUp();
    });
  }

  // private methods

  #showPopUp(subject, properties) {
    const stanzaDiv = document.createElement("div");
    const popupDiv = document.createElement("div");
    popupDiv.className = "popup";
    popupDiv.appendChild(this.#header(subject));
    popupDiv.appendChild(this.#stanzaContainer(subject, properties, stanzaDiv));

    this.#REPORT_MODAL.appendChild(popupDiv);
    this.#REPORT_MODAL.classList.add("-showing", "overlay");
  }

  #header(subject) {
    const header = document.createElement("header");
    header.innerHTML = `
      <div>
        <strong>${subject.value} </strong>
        <span class="type"> Main category / Subcategory</span>
      </div>
      <div>
        <a class="toreportpage" href="report.html?togoKey" target="_blank"><span class="material-icons-outlined">open_in_new</span></a>
        <a class="external-link"href="#">External Link</span>
      </span>
    `;
    header.childNodes[3].appendChild(this.#EXIT_BUTTON);

    return header;
  }

  #stanzaContainer(subject, properties, stanzaContainer) {
    console.log(subject, properties);
    // make stanzas
    stanzaContainer.className = "stanzas";
    stanzaContainer.innerHTML =
      this.#stanza(subject.id, subject.value) +
      properties
        .map((property) => {
          if (property === undefined) {
            return "";
          } else {
            const subject = Records.subjects.find((subject) =>
              subject.properties.some(
                (subjectProperty) =>
                  subjectProperty.propertyId === property.propertyId
              )
            );
            // TODO: 1個目のアトリビュートしか返していない
            return this.#stanza(subject.subjectId, property.attributes[0].id);
          }
        })
        .join("");
    // set navigation buttons
    stanzaContainer.innerHTML += `
        <div class="arrow up"></div>
        <div class="arrow right"></div>
        <div class="arrow down"></div>
        <div class="arrow left"></div>
      `;
    return stanzaContainer;
  }

  #stanza(subjectId, propertyId, value) {
    return `<div class="stanza-view" data-subject-id="${subjectId}" data-property-id=${propertyId}">${this.#templates[
      subjectId
    ].replace(/{{id}}/g, value)}</div>`;
  }

  #hidePopUp() {
    this.#REPORT_MODAL.classList.remove("-showing", "overlay");
    this.#REPORT_MODAL.innerHTML = "";
  }

  // public methods
  defineTemplates(templates) {
    console.log(templates);
    this.#templates = templates;
  }
}
