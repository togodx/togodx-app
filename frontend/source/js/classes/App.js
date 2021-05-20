import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilderView from './ConditionBuilderView.js';
import Records from './Records.js';
import ReportsView from './ReportsView.js';
import ConceptView from './ConceptView.js';
import ResultsTable from './ResultsTable.js';
import BalloonView from './BalloonView.js';
import ConditionsController from "./ConditionsController";
import UploadUserIDsView from "./UploadUserIDsView";
import * as event from '../events'
import * as api from '../api'

class App {

  #viewModes;
  #aggregate;

  constructor() {
  }

  ready() {

    const body = document.querySelector('body');

    // view modes
    this.#viewModes = {};
    document.querySelectorAll('#Properties > .header > nav .viewmodecontroller input[type="checkbox"]').forEach(checkbox => {
      this.#viewModes[checkbox.value] = checkbox.checked;
      checkbox.addEventListener('click', () => {
        if (checkbox.value === 'heatmap')  body.dataset.heatmap = checkbox.checked;
        this.#viewModes[checkbox.value] = checkbox.checked;
        const customEvent = new CustomEvent(event.changeViewModes, {detail: this.#viewModes});
        DefaultEventEmitter.dispatchEvent(customEvent);
      });
    });

    // set up views
    new ConditionBuilderView(document.querySelector('#ConditionBuilder'));
    new ConditionsController(document.querySelector('#Conditions'));
    const reportsView = new ReportsView(document.querySelector('#Reports'));
    new ResultsTable(document.querySelector('#ResultsTable'));
    new BalloonView();
    new UploadUserIDsView(document.querySelector('#UploadUserIDsView'));

    // load config json
    let stanzaTtemplates;
    Promise.all([
      fetch(api.PROPERTIES),
      fetch(api.TEMPLATES),
      fetch(api.AGGREGATE)
    ])
      .then(responces => Promise.all(responces.map(responce => responce.json())))
      .then(([subjects, templates, aggregate]) => {
        stanzaTtemplates = templates;
        Records.setSubjects(subjects);

        // define primary keys
        const togoKeys = subjects.map(subject => {
          return {
            label: subject.subject,
            togoKey: subject.togoKey,
            subjectId: subject.subjectId
          }
        });
        const customEvent = new CustomEvent(event.defineTogoKey, {detail: togoKeys});
        DefaultEventEmitter.dispatchEvent(customEvent);

        // set stanza scripts
        document.querySelector('head').insertAdjacentHTML('beforeend', templates.stanzas.map(stanza => `<script type="module" src="${stanza}" async></script>`).join(''));
        // aggregate
        this.#aggregate = Object.freeze(aggregate);

        // get stanza templates
        return Promise.all(
          Object.keys(templates.templates).map(key => fetch(templates.templates[key]))
        );
      })
      .then(responces => Promise.all(responces.map(responce => responce.text())))
      .then(templates => {
        // set stanza templates
        const stanzaTemplates = Object.fromEntries(Object.keys(stanzaTtemplates.templates).map((stanza, index) => [stanza, templates[index]]));
        reportsView.defineTemplates(stanzaTemplates);
        // define properties (app start)
        this.#makeConceptViews();
        // Records.setSubjects(this.#subjects);
      });
  }

  // private methods

  #makeConceptViews() {
    const conceptsContainer = document.querySelector('#Properties > .concepts');
    Records.subjects.forEach(subject => {
      const elm = document.createElement('section');
      new ConceptView(subject, elm);
      conceptsContainer.insertAdjacentElement('beforeend', elm);
    });
  }

  // public methods

  // utilities
  getHslColor(hue) {
    return `hsl(${hue}, 50%, 55%)`;
  }

  // accessor
  get viewModes() {
    return this.#viewModes;
  }
  get aggregatePrimaryKeys() {
    return this.#aggregate.filter.url;
  }
  get aggregateRows() {
    return this.#aggregate.table.url;
  }

}

export default new App();
