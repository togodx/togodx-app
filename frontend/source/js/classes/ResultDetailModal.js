import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records.js";
import * as event from "../events";

export default class ResultDetailModal {
  #templates;
  #RESULTS_TABLE 
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
    this._stanzas = {};
    this.#RESULTS_TABLE = document.querySelector("#ResultsTable");
    this.#RESULT_MODAL = document.querySelector(".result-detail-modal");
    this.#EXIT_BUTTON = document.createElement("div");
    this.#EXIT_BUTTON.className = "close-button";

    // attach event
    this.#EXIT_BUTTON.addEventListener("click", () => {
      this.#hidePopUp();
    });

    // event listener
    // DefaultEventEmitter.addEventListener(event.showStanza, (e) => {
    //   this.#showPopUp(e);
    //   // dragElement(document.getElementById("mydiv"));
    // });
    // DefaultEventEmitter.addEventListener(event.hideStanza, (e) => {
    //   this.#hidePopUp();
    // });
    DefaultEventEmitter.addEventListener(event.showPopup, (e) => {
      this.#showPopUp(e);
      // dragElement(document.getElementById("mydiv"));
    });

    DefaultEventEmitter.addEventListener(event.hidePopup, (e) => {
      this.#hidePopUp();
    });
  }

  // private methods
// TODO figure out why event triggers multiple times
  #showPopUp(e) {
    if(this.#RESULT_MODAL.innerHTML === ""){
      // TODO getStanzaData
    const stanzaDiv = document.createElement("div");
    stanzaDiv.className = "stanzas"
    stanzaDiv.innerHTML += `
      STANZAS HERE
    `
    const popupDiv = document.createElement("div");
    popupDiv.className = "popup";
    popupDiv.appendChild(this.#header(e.detail.keys , e.detail.properties));
    popupDiv.innerHTML+= `      
      <div class="arrow up"></div>
      <div class="arrow right"></div>
      <div class="arrow down"></div>
      <div class="arrow left"></div>
    `
    popupDiv.appendChild(stanzaDiv);
    // popupDiv.appendChild(this.#stanzaContainer(e.detail.subject, e.detail.properties, stanzaDiv));

    this.#RESULT_MODAL.appendChild(popupDiv);
    this.#RESULT_MODAL.classList.add("-showing", "overlay");

    }
  }

  #header(keys, props) {
    const subject = Records.getSubject(keys.subjectId);
    const mainCategory = props.isReport ? ``: Records.getProperty(keys.mainCategoryId);
    const subCategory = props.isReport ? ``: Records.getValue(keys.mainCategoryId, keys.subCategoryId);

    const extLink = props.isReport ? ``: `<a class="external-link" href=${props.externalLink}>External Link`;
    const parentInfo = props.isReport ? keys.dataKey : `<span style="color: ${App.getHslColor(subject.hue + 90)}">${subject.label}　/　${mainCategory.label}</span>`
    const header = document.createElement("header");
    header.style.backgroundColor = App.getHslColor(subject.hue);
    header.innerHTML = `
      <div>
        <strong>${props.isReport?  keys.uniqueEntryId  : subCategory.label } </strong>
        ${parentInfo}
      </div>
      <div>
        <a class="toreportpage" href="${props.reportLink}" target="_blank"><span class="material-icons-outlined">open_in_new</span></a>
        ${extLink}
    `;
    header.lastChild.appendChild(this.#EXIT_BUTTON);

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
    this.#RESULT_MODAL.classList.remove("-showing", "overlay");
    this.#RESULT_MODAL.innerHTML = "";
    this.#RESULTS_TABLE .querySelectorAll('tr').forEach(tr => tr.classList.remove('-selected'));
  }

// dragElement(elmnt) {
//   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;

//    dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }

//    elementDrag(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//   }

//    closeDragElement() {
//     // stop moving when mouse button is released:
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
}
