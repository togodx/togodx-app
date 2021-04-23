import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from './Records.js';

export default class ReportsView {

  #templates;
  #BODY;
  #STANZAS_CONTAINER;

  constructor(elm) {

    this._stanzas = {};

    // references
    this.#BODY = document.querySelector('body');
    this.#STANZAS_CONTAINER = elm.querySelector(':scope > .stanzas');
    const returnButton = elm.querySelector(':scope > footer > button.return');

    // attach event
    returnButton.addEventListener('click', () => {
      this.#BODY.dataset.display = 'properties';
    });

    // event listener
    DefaultEventEmitter.addEventListener('showStanza', e => {
      this.#showStanza(e.detail.subject, e.detail.properties);
    });
    DefaultEventEmitter.addEventListener('hideStanza', e => {
      this.#hideStanza();
    });
  }

  // private methods

  #showStanza(subject, properties) {
    console.log(subject, properties)
    // make stanzas
    this.#STANZAS_CONTAINER.innerHTML
      = this.#stanza(subject.id, subject.value)
      +　properties
        .map(property => {
          if (property === undefined) {
            return '';
          } else {
            const subject = Records.subjects.find(subject => subject.properties.some(subjectProperty => subjectProperty.propertyId === property.propertyId));
            // TODO: 1個目のアトリビュートしか返していない
            return this.#stanza(subject.subjectId, property.attributes[0].id);
          }
        }).join('');
  }

  #hideStanza() {
    this.#STANZAS_CONTAINER.innerHTML = '';
  }

  #stanza(subjectId, value) {
    return `<div class="stanza-view">${this.#templates[subjectId].replace(/{{id}}/g, value)}</div>`;
  }

  // public methods

  defineTemplates(templates) {
    console.log(templates)
    this.#templates = templates;
  }

}
