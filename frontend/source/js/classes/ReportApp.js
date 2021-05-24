import Records from './Records';
import * as api from '../api'

class ReportApp {

  #templates;

  constructor() {
  }

  ready() {

    let stanzaTtemplates;
    // load config json
    Promise.all([
      fetch(api.PROPERTIES),
      fetch(api.TEMPLATES)
    ])
      .then(responces => Promise.all(responces.map(responce => responce.json())))
      .then(([subjects, templates]) => {
        stanzaTtemplates = templates;
        Records.setSubjects(subjects);

        // set stanza scripts
        document.querySelector('head').insertAdjacentHTML('beforeend', templates.stanzas.map(stanza => `<script type="module" src="${stanza}"></script>`).join(''));

        // get stanza templates
        return Promise.all(
          Object.keys(templates.templates).map(key => fetch(templates.templates[key]))
        );
      })
      .then(responces => Promise.all(responces.map(responce => responce.text())))
      .then(templates => {
        this.#templates = Object.fromEntries(Object.keys(stanzaTtemplates.templates).map((stanza, index) => [stanza, templates[index]]));

        this.#drawStanzas();
      });
  }

  #drawStanzas() {
    const urlVars = Object.fromEntries(window.location.search.substr(1).split('&').map(keyValue => keyValue.split('=')));
    const properties = JSON.parse(decodeURIComponent(urlVars.properties));
    
    const main = document.querySelector('main');
    const subjectId = Records.subjects.find(subject => subject.togoKey === urlVars.togoKey).subjectId;
    main.innerHTML =
      this.#stanza(subjectId, urlVars.id, urlVars.togoKey) +
      properties.map(property => {
        if (property === undefined) {
          return '';
        } else {
          const subject = Records.subjects.find(subject => subject.properties.some(subjectProperty => subjectProperty.propertyId === property.propertyId));
          const property2 = subject.properties.find(property => property.propertyId === property.propertyId);
          return `<hr>
          <div class="attributes">
            <header style="background-color: ${this.getHslColor(subject.hue)};">${property2.label}</header>
            ${property.attributes.map(attribute => this.#stanza(subject.subjectId, attribute.id, property.propertyKey)).join('')}
          </div>`;
        }
      }).join('');
  }

  #stanza(subjectId, id, key) {
    return `<div class="stanza">${this.#templates[subjectId].replace(/{{id}}/g, id).replace(/{{type}}/g, key)}</div>`;
  }

  // utilities
  getHslColor(hue) {
    return `hsl(${hue}, 50%, 55%)`;
  }

}

export default new ReportApp();
