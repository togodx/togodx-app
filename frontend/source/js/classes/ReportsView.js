import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records.js";
import * as event from "../events";

export default class ReportsView {
  #templates;
  #BODY;
  #ROOT;
  #EXIT_BUTTON;

  constructor(elm) {
    // references
    this._stanzas = {};
    this.#BODY = document.querySelector("body");
    const returnButton = elm.querySelector(":scope > footer > button.return");

    // attach event
    returnButton.addEventListener("click", () => {
      this.#BODY.dataset.display = "properties";
    });

  }

  // private methods

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
    return stanzaContainer;
  }

  #stanza(subjectId, propertyId, value) {
    return `<div class="stanza-view" data-subject-id="${subjectId}" data-property-id=${propertyId}">${this.#templates[
      subjectId
    ].replace(/{{id}}/g, value)}</div>`;
  }

  

  // public methods
  defineTemplates(templates) {
    console.log(templates);
    this.#templates = templates;
  }
}
