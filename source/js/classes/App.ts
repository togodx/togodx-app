import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilderView from './ConditionBuilderView';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import CategoryView from './CategoryView';
import PresetView from './PresetView';
import ResultDetailModal from './ResultDetailModal';
import BalloonView from './BalloonView';
import ConditionsController from './ConditionsController';
import UploadUserIDsView from './UploadUserIDsView';
import Color from 'colorjs.io';
import StanzaManager from './StanzaManager';
import ResultsTable from './ResultsTable';
import PresetManager from './PresetManager';
import * as event from '../events';
import {Config, ViewModes, Backend, API} from '../interfaces';

class App {
  #viewModes: ViewModes;
  #backend: Backend;

  #colorWhite: Color;
  #colorLightGray: Color;
  #colorSilver: Color;
  #colorGray: Color;
  #colorDarkGray: Color;
  #colorLampBlack: Color;

  constructor() {
    this.#colorWhite = new Color('white').to('srgb');
    this.#colorLightGray = new Color('--color-light-gray').to('srgb');
    this.#colorSilver = new Color('--color-silver').to('srgb');
    this.#colorGray = new Color('--color-gray').to('srgb');
    this.#colorDarkGray = new Color('--color-dark-gray').to('srgb');
    this.#colorLampBlack = new Color('--color-lamp-black').to('srgb');
  }

  async ready(config: Config): Promise<void> {
    // view modes
    this.#viewModes = {};
    document
      .querySelectorAll<HTMLInputElement>(
        '#Properties > .inner > .header > nav .viewmodecontroller input[type="checkbox"]'
      )
      .forEach(checkbox => {
        this.#viewModes[checkbox.value] = checkbox.checked;
        checkbox.addEventListener('click', () => {
          if (checkbox.value === 'heatmap')
          document.body.dataset.heatmap = checkbox.checked.toString();
          this.#viewModes[checkbox.value] = checkbox.checked;
          const customEvent = new CustomEvent(event.changeViewModes, {
            detail: this.#viewModes,
          });
          DefaultEventEmitter.dispatchEvent(customEvent);
        });
      });
    // events
    DefaultEventEmitter.addEventListener(event.restoreParameters, () => {
      document.querySelector<HTMLDivElement>('#App > .loading-view')!.classList.remove('-shown');
    });
    // set up views
    new ConditionBuilderView(document.querySelector('#ConditionBuilder'));
    new ConditionsController(document.querySelector('#Conditions')!);
    new PresetView();
    new ResultDetailModal();
    new BalloonView();
    new UploadUserIDsView(document.querySelector('#UploadUserIDsView'));
    new ResultsTable(document.querySelector('#ResultsTable'));

    // standard displayed attributes
    await PresetManager.init(config.PRESET);

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

  #makeCategoryViews(): void {
    const conceptsContainer = document.querySelector(
      '#Properties > .inner > .concepts'
    )!;
    Records.categories.forEach(category => {
      // TODO: define type of 'category'
      const section = document.createElement('section');
      new CategoryView(category, section);
      conceptsContainer.insertAdjacentElement('beforeend', section);
    });
  }

  #defineAllTracksCollapseButton(): void {
    const collapsebutton = document.querySelector(
      '#Properties > .inner > header > .title > h2.collapsebutton'
    )!;
    collapsebutton.addEventListener('click', () => {
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
  getApiUrl(api: API): string {
    return this.#backend[api].url;
  }

  // accessor
  get viewModes(): ViewModes {
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
  get colorWhite(): Color {
    return this.#colorWhite;
  }
  get colorLightGray(): Color {
    return this.#colorLightGray;
  }
  get colorSilver(): Color {
    return this.#colorSilver;
  }
  get colorGray(): Color {
    return this.#colorGray;
  }
  get colorDarkGray(): Color {
    return this.#colorDarkGray;
  }
  get colorLampBlack(): Color {
    return this.#colorLampBlack;
  }
}

export default new App();
