import Records from './Records';
import StanzaManager from "./StanzaManager";
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
        // stanzaTtemplates = templates;
        Records.setSubjects(subjects);

        // initialize stanza manager
        StanzaManager.init(templates);

        // wait ready stanza manager
        const intervalId = window.setInterval(() => {
          console.log(StanzaManager.isReady)
          if (StanzaManager.isReady) {
            window.clearInterval(intervalId);
            this.#drawStanzas();
          }
        }, 100);
      });
  }

  #drawStanzas() {
    const urlVars = Object.fromEntries(window.location.search.substr(1).split('&').map(keyValue => keyValue.split('=')));
    const properties = JSON.parse(decodeURIComponent(urlVars.properties));
    
    const main = document.querySelector('main');
    const subjectId = Records.subjects.find(subject => subject.togoKey === urlVars.togoKey).subjectId;
    main.innerHTML =
      StanzaManager.draw(subjectId, urlVars.id, urlVars.togoKey) +
      properties.map(property => {
        if (property === undefined) {
          return '';
        } else {
          const subject = Records.subjects.find(subject => subject.properties.some(subjectProperty => subjectProperty.propertyId === property.propertyId));
          const property2 = subject.properties.find(property => property.propertyId === property.propertyId);
          return `<hr>
          <div class="attributes">
            <header style="background-color: ${this.getHslColor(subject.colorCSSValue)};">${property2.label}</header>
            ${property.attributes.map(attribute => StanzaManager.draw(subject.subjectId, attribute.id, property.propertyKey)).join('')}
          </div>`;
        }
      }).join('');
  }

  // utilities
  getHslColor(hue) {
    return `hsl(${hue}, 50%, 55%)`;
  }

}

export default new ReportApp();
