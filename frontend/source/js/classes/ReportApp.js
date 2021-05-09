// import DefaultEventEmitter from "./DefaultEventEmitter";

const CONF_PROPERTIES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/properties.json';
const CONF_TEMPLATES = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/templates.json';
const CONF_AGGREGATE = 'https://raw.githubusercontent.com/dbcls/togosite/develop/config/togosite-human/aggregate.json';

class ReportApp {

  #subjects;
  #templates;

  constructor() {
  }

  ready() {

    let stanzaTtemplates;
    // load config json
    Promise.all([
      fetch(CONF_PROPERTIES),
      fetch(CONF_TEMPLATES),
      fetch(CONF_AGGREGATE)
    ])
      .then(responces => Promise.all(responces.map(responce => responce.json())))
      .then(([subjects, templates, aggregate]) => {
        console.log(subjects)
        console.log(templates)
        // console.log(aggregate)
        stanzaTtemplates = templates;
        this.#subjects = subjects;

        // set stanza scripts
        document.querySelector('head').insertAdjacentHTML('beforeend', templates.stanzas.map(stanza => `<script type="module" src="${stanza}"></script>`).join(''));

        // get stanza templates
        return Promise.all(
          Object.keys(templates.templates).map(key => fetch(templates.templates[key]))
        );
      })
      .then(responces => Promise.all(responces.map(responce => responce.text())))
      .then(templates => {
        console.log(templates)
        this.#templates = Object.fromEntries(Object.keys(stanzaTtemplates.templates).map((stanza, index) => [stanza, templates[index]]));

        this.#drawStanzas();
      });
  }

  #drawStanzas() {
    const urlVars = Object.fromEntries(window.location.search.substr(1).split('&').map(keyValue => keyValue.split('=')));
    console.log( urlVars )
    console.log( JSON.parse(decodeURIComponent(urlVars.properties)) )
    const properties = JSON.parse(decodeURIComponent(urlVars.properties));
    console.log(properties)
    
    const main = document.querySelector('main');
    const subjectId = this.#subjects.find(subject => subject.togoKey === urlVars.togoKey).subjectId;
    main.innerHTML =
      this.#templates[subjectId].replace(/{{id}}/g, urlVars.id).replace(/{{type}}/g, urlVars.togoKey) +
      properties.map(property => {
        console.log(property)
        if (property === undefined) {
          return '';
        } else {
          const subject = this.#subjects.find(subject => subject.properties.some(subjectProperty => subjectProperty.propertyId === property.propertyId));
          const template = this.#templates[subject.subjectId];
          // TODO: 1個目のアトリビュートしか返していない
          return '<hr>' + property.attributes.map(attribute => template.replace(/{{id}}/g, attribute.id).replace(/{{type}}/g, property.propertyKey)).join('');
        }
      }).join('');

  }

}

export default new ReportApp();
