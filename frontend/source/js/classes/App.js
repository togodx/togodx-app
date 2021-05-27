import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilderView from './ConditionBuilderView';
import Records from './Records';
import ReportsView from './ReportsView';
import ConceptView from './ConceptView';
import ResultsTable from './ResultsTable';
import BalloonView from './BalloonView';
import ConditionsController from "./ConditionsController";
import UploadUserIDsView from "./UploadUserIDsView";
import Color from "./Color";
import StanzaManager from "./StanzaManager";
import * as event from '../events'
import * as api from '../api'

class App {

  #viewModes;
  #aggregate;
  #colorLampBlack;

  constructor() {
    this.#colorLampBlack = new Color('--color-lamp-black').to('srgb');
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
        // stanzaTtemplates = templates;
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

        // initialize stanza manager
        StanzaManager.init(templates);

        // aggregate
        this.#aggregate = Object.freeze(aggregate);

        this.#makeConceptViews();
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
  get colorLampBlack() {
    return this.#colorLampBlack;
  }

}

export default new App();
