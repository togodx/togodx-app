import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records.js";
import * as event from "../events";

export default class ResultDetailModal {
  #templates;
  #BODY;
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
    this.#BODY = document.querySelector("body");
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
      <div class="arrow up"></div>
      <div class="arrow right"></div>
      <div class="arrow down"></div>
      <div class="arrow left"></div>
    `

    const popupDiv = document.createElement("div");
    popupDiv.className = "popup";
    popupDiv.appendChild(this.#header(e.detail.subject , e.detail.properties));
    // const prop = Records.getProperty(e.detail.subject.propertyId);
    // const value = Records.getValue(e.detail.subject.propertyId, e.detail.subject.categoryId);
    // console.log(prop);
    // console.log(value);
    popupDiv.appendChild(stanzaDiv);
    // popupDiv.appendChild(this.#stanzaContainer(e.detail.subject, e.detail.properties, stanzaDiv));

    this.#RESULT_MODAL.appendChild(popupDiv);
    this.#RESULT_MODAL.classList.add("-showing", "overlay");

    }
  }

  #header(subject, properties) {
    const isReport = properties.isReport;
    const extLink = isReport ? ``: `<a class="external-link"href=${subject.dataKey}>External Link`;
    const categories = isReport ? subject.categoryId : `<span class="type"> ${subject.subjectId} / ${Records.getProperty(subject.propertyId).label}</span>`
    const header = document.createElement("header");
    header.style.backgroundColor = App.getHslColor(subject.subjectId);
    header.innerHTML = `
      <div>
        <strong>${isReport?  ''  : Records.getValue(subject.propertyId, subject.categoryId).label } </strong>
        ${categories}
      </div>
      <div>
        <a class="toreportpage" href="report.html?togoKey=${subject.togoKey}" target="_blank"><span class="material-icons-outlined">open_in_new</span></a>
        ${extLink}
    `;
  //   header.innerHTML = `
  //   <div>
  //     <strong>${isReport? subject.categoryId : properties.label } </strong>
  //     ${title}
  //   </div>
  //   <div>
  //     <a class="toreportpage" href="report.html?togoKey=${properties.reportLink}" target="_blank"><span class="material-icons-outlined">open_in_new</span></a>
  //     ${extLink}
  // `;
    // TODO: improve getting nodes based on num
    header.childNodes[3].appendChild(this.#EXIT_BUTTON);

    return header;
  }

  // #stanzaContainer(subject, properties, stanzaContainer) {
  //   console.log(subject, properties);
  //   // make stanzas
  //   stanzaContainer.className = "stanzas";
  //   stanzaContainer.innerHTML =
  //     this.#stanza(subject.id, subject.value) +
  //     properties
  //       .map((property) => {
  //         if (property === undefined) {
  //           return "";
  //         } else {
  //           const subject = Records.subjects.find((subject) =>
  //             subject.properties.some(
  //               (subjectProperty) =>
  //                 subjectProperty.propertyId === property.propertyId
  //             )
  //           );
  //           // TODO: 1個目のアトリビュートしか返していない
  //           return this.#stanza(subject.subjectId, property.attributes[0].id);
  //         }
  //       })
  //       .join("");
  //   // set navigation buttons
  //   stanzaContainer.innerHTML += `
  //       <div class="arrow up"></div>
  //       <div class="arrow right"></div>
  //       <div class="arrow down"></div>
  //       <div class="arrow left"></div>
  //     `;
  //   return stanzaContainer;
  // }

  // #stanza(subjectId, propertyId, value) {
  //   return `<div class="stanza-view" data-subject-id="${subjectId}" data-property-id=${propertyId}">${this.#templates[
  //     subjectId
  //   ].replace(/{{id}}/g, value)}</div>`;
  // }

  #hidePopUp() {
    this.#RESULT_MODAL.classList.remove("-showing", "overlay");
    this.#RESULT_MODAL.innerHTML = "";
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
