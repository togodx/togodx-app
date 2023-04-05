import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import ConditionResultsPanelView from './ConditionResultsPanelView';
// import ConditionAnnotation from './ConditionAnnotation';
import * as event from '../events';
import axios from 'axios';

const downloadUrls = new Map();
const timeOutError = 'ECONNABORTED';

/**
 * @typedef { Object } Mode
 * @property { string } label
 * @property { string } icon
 * @property { string } dataButton
 */
const dataButtonModes = new Map([
  [
    'edit',
    {
      label: 'Edit',
      icon: 'edit',
      dataButton: 'edit',
    },
  ],
  [
    'resume',
    {
      label: 'Resume',
      icon: 'play_arrow',
      dataButton: 'resume',
    },
  ],
  [
    'pause',
    {
      label: 'Pause',
      icon: 'pause',
      dataButton: 'pause',
    },
  ],
  [
    'tsv',
    {
      label: 'TSV',
      icon: 'download',
      dataButton: 'download-tsv',
    },
  ],
  [
    'json',
    {
      label: 'JSON',
      icon: 'download',
      dataButton: 'download-json',
    },
  ],
  [
    'retry',
    {
      label: 'Retry',
      icon: 'refresh',
      dataButton: 'retry',
    },
  ],
  [
    'empty',
    {
      label: '',
      icon: '',
      dataButton: '',
    },
  ],
]);

export default class ConditionResultsController {
  #dxCondition;
  #source;
  #isLoading;
  #panelView;
  #status;
  #statusProxy;
  #ROOT;
  #CONTROLLER;
  #BUTTON_LEFT;
  #BUTTON_RIGHT;

  constructor(dxCondition) {
    const cancelToken = axios.CancelToken;
    this.#source = cancelToken.source();
    this.#status = {total: -1, current: 0};

    this.#isLoading = false;
    this.#dxCondition = dxCondition;

    this.#panelView = new ConditionResultsPanelView(this);
    // this.#statusProxy = this.#panelView.controllerStatusProxy(this.#status);
    this.#status = this.#panelView.controllerStatusProxy({});

    const elm = this.#panelView.element;

    // reference
    this.#ROOT = elm;

    this.#CONTROLLER = elm.querySelector(':scope > .controller');
    this.#CONTROLLER.appendChild(this.#makeDataButton('left'));
    this.#CONTROLLER.appendChild(
      this.#makeDataButton('right', dataButtonModes.get('edit'))
    );
    this.#BUTTON_LEFT = elm.querySelector(
      ':scope > .controller > .button.left'
    );
    this.#BUTTON_RIGHT = elm.querySelector(
      ':scope > .controller > .button.right'
    );

    // events
    elm.addEventListener('click', () => {
      if (elm.classList.contains('-current')) return;
      this.select();
    });

    // delete
    elm
      .querySelector(':scope > .close-button-view')
      .addEventListener('click', e => {
        this.#deleteCondition(e);
      });

    ConditionBuilder.finish();
    this.select();
    elm.classList.toggle('-loading');
    this.#getQueryIds();
  }

  /* private methods */
  #deleteCondition(e) {
    e.stopPropagation();
    const customEvent = new CustomEvent(event.deleteConditionResults, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
    // abort fetch
    this.#source.cancel('user cancel');
    // delete element
    this.#ROOT.parentNode.removeChild(this.#ROOT);
    // transition
    document.querySelector('body').dataset.display = 'properties';
  }

  // *** Responsive Buttons based on dataButtonModes ***
  /**
   * @param { string } className
   * @param { Mode } mode
   */
  #makeDataButton(className, mode = undefined) {
    const button = document.createElement('div');
    button.innerHTML = `
      <a>
        <span class="material-icons-outlined"></span>
        <span class="label"></span>
      </a>`;
    button.classList.add('button', className);

    if (mode) this.#updateDataButton(button, mode);
    button.addEventListener('click', e => {
      this.#dataButtonEvent(e);
    });

    return button;
  }

  /**
   * @param { HTMLElement } target
   * @param { Mode } mode
   * @param { string } urlType
   */
  #updateDataButton(target, mode, urlType) {
    target.dataset.button = mode.dataButton;
    const anchor = target.querySelector(':scope > a');
    anchor.querySelector(':scope > .material-icons-outlined').innerText =
      mode.icon;
    anchor.querySelector(':scope > .label').innerText = mode.label;
    if (urlType) {
      const url = downloadUrls.get(urlType);
      anchor.setAttribute('href', url);
      const timeStamp = new Date();
      const [date, time] = [
        timeStamp.toISOString().slice(0, 10).replaceAll('-', ''),
        timeStamp.toLocaleTimeString().replaceAll(':', ''),
      ];
      anchor.setAttribute('download', `togodx-${date}-${time}.${urlType}`);
    }
  }

  /**
   * @param { MouseEvent } e
   */
  #dataButtonEdit(e) {
    e.stopPropagation();
    // property (attribute)
    ConditionBuilder.setAnnotation(
      this.#dxCondition.conditionAnnotations.map(conditionAnnotation => {
        return conditionAnnotation;
      }),
      false
    );
    // attribute (classification/distribution)
    Records.attributes.forEach(({id}) => {
      const conditionFilter = this.#dxCondition.conditionFilters.find(
        conditionFilter => conditionFilter.attributeId === id
      );
      const nodes = [];
      if (conditionFilter) nodes.push(...conditionFilter.nodes);
      ConditionBuilder.setFilter(id, nodes, false);
    });
  }

  #dataButtonRetry() {
    this.#panelView.statusElement.classList.remove('-error');
    this.#ROOT.classList.toggle('-loading');
    this.#updateDataButton(this.#BUTTON_LEFT, dataButtonModes.get('empty'));

    const partiallyLoaded = this.#dxCondition.ids.length > 0;
    const message = partiallyLoaded ? 'Getting data' : 'Getting ID list';
    this.#panelView.statusElement.textContent = message;

    if (partiallyLoaded) this.#getProperties();
    else this.#getQueryIds();
  }

  /**
   * @param { MouseEvent } e
   */
  #dataButtonEvent(e) {
    const button = e.currentTarget;
    const mode = button.dataset.button;
    switch (mode) {
      case 'edit':
        this.#dataButtonEdit(e);
        break;

      case 'retry':
        this.#dataButtonRetry();
        break;
    }
  }

  #setDownloadButtons() {
    this.#setTsvUrl();
    this.#updateDataButton(
      this.#BUTTON_LEFT,
      dataButtonModes.get('tsv'),
      'tsv'
    );

    this.#setJsonUrl();
    const middleButton = this.#makeDataButton('middle', 'json');
    this.#updateDataButton(middleButton, dataButtonModes.get('json'), 'json');
    this.#CONTROLLER.insertBefore(middleButton, this.#BUTTON_RIGHT);
  }

  #setJsonUrl() {
    const jsonBlob = new Blob([JSON.stringify(this.data, null, 2)], {
      type: 'application/json',
    });
    downloadUrls.set('json', URL.createObjectURL(jsonBlob));
  }

  #setTsvUrl() {
    const tsv = [
      [
        'orig_dataset',
        'orig_entry',
        'orig_label',
        'dest_dataset',
        'dest_entry',
        'node',
        'value',
      ].join('\t'),
      ...this.data
        .map(row => {
          return row.attributes
            .map(attribute => {
              return attribute.items.map(item => {
                return [
                  this.#dxCondition.togoKey, // orig_dataset
                  row.index.entry, // orig_entry
                  row.index.label, // orig_label
                  item.dataset, // dest_dataset
                  item.entry, // dest_entry
                  attribute.id, // node
                  item.label, // value
                ].join('\t');
              });
            })
            .flat();
        })
        .flat(),
    ].join('\n');
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const tsvBlob = new Blob([bom, tsv], {type: 'text/plain'});
    const tsvUrl = URL.createObjectURL(tsvBlob);
    downloadUrls.set('tsv', tsvUrl);
  }

  // *** Properties & Loading ***
  /**
   * @param { Error } err - first check userCancel, then server error, timeout err part of else
   */
  #handleError(err) {
    if (axios.isCancel && err.message === 'user cancel') return;

    const code = err.response?.status;
    const message = err.response?.statusText || err.message;
    this.#displayError(message, code);

    if ((err.response?.status === 500) | (err.code === timeOutError)) {
      this.#updateDataButton(this.#BUTTON_LEFT, dataButtonModes.get('retry'));
      return;
    }
    this.#BUTTON_LEFT.remove();
  }

  /**
   * @param { string } message - errorMessage
   * @param { number } code - errorCode na in case of timeout or other
   */
  #displayError(message, code) {
    this.#panelView.statusElement.classList.add('-error');
    this.#panelView.statusElement.textContent = code
      ? `${message} (${code})`
      : message;
    this.#ROOT.classList.toggle('-loading');

    const customEvent = new CustomEvent(event.failedFetchConditionResultsIDs, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  async #getQueryIds() {
    // get IDs
    await this.#dxCondition.ids;
    // await this.#dxCondition.ids.catch(error => {
    //   console.error(error);
    //   this.#handleError(error);
    // });
    this.#status.total = this.total;
    console.log(this.#status);
    if (this.total <= 0) {
      // retry case
      this.#completed(false);
      const customEvent = new CustomEvent(event.addNextRows, {
        detail: {
          dxCondition: this.#dxCondition,
          offset: 0,
          nextRows: [],
        },
      });
      DefaultEventEmitter.dispatchEvent(customEvent);
      return;
    }
    // this.#panelView.loadedIds();
    // this.#updateDataButton(this.#BUTTON_LEFT, dataButtonModes.get('pause'));
    this.#getProperties();
  }

  async #getProperties() {
    this.#isLoading = true;
    const startTime = Date.now();

    const offset = this.offset;
    const nextRows = await this.#dxCondition
      .getNextProperties()
      .catch(error => this.#handleError(error));
    this.#panelView.progressIndicator.updateProgressBar({
      offset: this.offset,
      startTime,
    });

    // dispatch event
    const customEvent = new CustomEvent(event.addNextRows, {
      detail: {
        dxCondition: this.#dxCondition,
        offset,
        nextRows,
      },
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
    // turn off after finished
    if (this.#dxCondition.isPropertiesLoaded) {
      this.#completed();
      return;
    }
    if (this.#isLoading) this.#getProperties();
  }

  /**
   * @param { boolean } withData
   */
  #completed(withData = true) {
    this.#ROOT.dataset.status = 'complete';
    this.#panelView.statusElement.textContent = withData
      ? 'Complete'
      : 'No Data Found';
    this.#ROOT.classList.remove('-loading');

    if (withData) this.#setDownloadButtons();
  }

  /* public methods */
  select() {
    this.#ROOT.classList.add('-current');
    // dispatch event
    const customEvent1 = new CustomEvent(event.selectConditionResults, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent1);
    // send rows
    if (this.#ROOT.dataset.status !== 'load ids') {
      const customEvent2 = new CustomEvent(event.addNextRows, {
        detail: {
          dxCondition: this.#dxCondition,
          offset: 0,
          nextRows: this.data,
        },
      });
      DefaultEventEmitter.dispatchEvent(customEvent2);
    }
  }

  deselect() {
    this.#ROOT.classList.remove('-current');
  }

  next() {
    if (this.#isLoading) return;
    this.#getProperties();
  }

  pauseOrResume(isLoading) {
    this.#isLoading = isLoading;
    if (this.#isLoading) this.#getProperties();
  }

  /* public accessors */
  get offset() {
    return this.#dxCondition.offset;
  }
  get total() {
    return this.#dxCondition.ids?.length;
  }
  get togoKey() {
    return this.#dxCondition.togoKey;
  }
  get dxCondition() {
    return this.#dxCondition;
  }
  get data() {
    return [...this.#dxCondition.properties];
  }
  get rateOfProgress() {
    return this.offset / this.total;
  }
  get element() {
    return this.#panelView.element;
  }
}
