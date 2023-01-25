import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilderView from './ConditionBuilderView';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import CategoryView from './CategoryView';
import ResultsTable from './ResultsTable';
import ResultDetailModal from './ResultDetailModal';
import BalloonView from './BalloonView';
import ConditionsController from './ConditionsController';
import UploadUserIDsView from './UploadUserIDsView';
import Color from './Color';
import StanzaManager from './StanzaManager';
import * as event from '../events';

class App {
  #viewModes;
  #backend;

  #colorWhite;
  #colorLightGray;
  #colorSilver;
  #colorGray;
  #colorDarkGray;
  #colorLampBlack;

  constructor() {
    this.#colorWhite = new Color('white').to('srgb');
    this.#colorLightGray = new Color('--color-light-gray').to('srgb');
    this.#colorSilver = new Color('--color-silver').to('srgb');
    this.#colorGray = new Color('--color-gray').to('srgb');
    this.#colorDarkGray = new Color('--color-dark-gray').to('srgb');
    this.#colorLampBlack = new Color('--color-lamp-black').to('srgb');
  }

  ready(config) {
    const body = document.body;

    // view modes
    this.#viewModes = {};
    document
      .querySelectorAll(
        '#Properties > .header > nav .viewmodecontroller input[type="checkbox"]'
      )
      .forEach(checkbox => {
        this.#viewModes[checkbox.value] = checkbox.checked;
        checkbox.addEventListener('click', () => {
          if (checkbox.value === 'heatmap')
            body.dataset.heatmap = checkbox.checked;
          this.#viewModes[checkbox.value] = checkbox.checked;
          const customEvent = new CustomEvent(event.changeViewModes, {
            detail: this.#viewModes,
          });
          DefaultEventEmitter.dispatchEvent(customEvent);
        });
      });

    // events
    DefaultEventEmitter.addEventListener(event.restoreParameters, () => {
      document.querySelector('#App > .loading-view').classList.remove('-shown');
    });

    // set up views
    new ConditionBuilderView(document.querySelector('#ConditionBuilder'));
    new ConditionsController(document.querySelector('#Conditions'));
    new ResultsTable(document.querySelector('#ResultsTable'));
    new ResultDetailModal();
    new BalloonView();
    new UploadUserIDsView(document.querySelector('#UploadUserIDsView'));

    // load config json
    Promise.all([
      fetch(config.TEMPLATES),
      fetch(config.BACKEND),
      fetch(config.ATTRIBUTES),
    ])
      .then(responces => {
        return Promise.all(responces.map(responce => responce.json()));
      })
      .then(([templates, backend, attributes]) => {
        Records.setAttributes(attributes);

        // define primary keys
        const customEvent = new CustomEvent(event.defineTogoKey, {
          detail: {datasets: attributes.datasets},
        });
        DefaultEventEmitter.dispatchEvent(customEvent);

        // initialize stanza manager
        StanzaManager.init(templates);

        // aggregate
        this.#backend = Object.freeze(backend);

        this.#makeCategoryViews();
        this.#defineAllTracksCollapseButton();

        ConditionBuilder.init();
      });
  }

  // private methods

  #makeCategoryViews() {
    const conceptsContainer = document.querySelector('#Properties > .concepts');
    Records.categories.forEach(category => {
      const elm = document.createElement('section');
      new CategoryView(category, elm);
      conceptsContainer.insertAdjacentElement('beforeend', elm);
    });
  }

  #defineAllTracksCollapseButton() {
    const collapsebutton = document.querySelector(
      '#Properties > header > .title > h2.collapsebutton'
    );
    collapsebutton.addEventListener('click', e => {
      let customEvent = new CustomEvent(event.allTracksCollapse);
      if (collapsebutton.classList.contains('-spread')) {
        collapsebutton.classList.remove('-spread');
        customEvent = new CustomEvent(event.allTracksCollapse, {detail: false});
      } else {
        collapsebutton.classList.add('-spread');
        customEvent = new CustomEvent(event.allTracksCollapse, {detail: true});
      }
      DefaultEventEmitter.dispatchEvent(customEvent);
    });
  }

  // public methods

  /**
   *
   * @param {String} api 'aggregate' or 'dataframe' or 'locate'
   * @returns
   */
  getApiUrl(api) {
    return this.#backend[api].url;
  }

  // accessor
  get viewModes() {
    return this.#viewModes;
  }
  // get aggregate() {
  //   return this.#backend.aggregate.url;
  // }
  // get dataframe() {
  //   return this.#backend.dataframe.url;
  // }
  // get locate() {
  //   return this.#backend.locate.url;
  // }
  get colorWhite() {
    return this.#colorWhite;
  }
  get colorLightGray() {
    return this.#colorLightGray;
  }
  get colorSilver() {
    return this.#colorSilver;
  }
  get colorGray() {
    return this.#colorGray;
  }
  get colorDarkGray() {
    return this.#colorDarkGray;
  }
  get colorLampBlack() {
    return this.#colorLampBlack;
  }
}

export default new App();
