import App from './App';
import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import {getApiParameter} from '../functions/queryTemplates';
import ProgressIndicator from './ProgressIndicator';
import ConditionAnnotation from './ConditionAnnotation';
import * as event from '../events';
import axios from 'axios';

const LIMIT = 100;
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

export default class TableData {
  #dxCondition;
  #queryIds;
  #rows;
  #source;
  #isLoading;
  #isCompleted;
  #ROOT;
  #STATUS;
  #progressIndicator;
  #CONTROLLER;
  #BUTTON_LEFT;
  #BUTTON_RIGHT;

  constructor(dxCondition, elm) {
    const cancelToken = axios.CancelToken;
    this.#source = cancelToken.source();

    this.#isLoading = false;
    this.#isCompleted = false;
    this.#dxCondition = dxCondition;
    this.#queryIds = [];
    this.#rows = [];

    // view
    elm.classList.add('table-data-controller-view');
    elm.dataset.status = 'load ids';

    elm.innerHTML = `
    <div class="close-button-view"></div>
    <div class="conditions">
      <div class="condition">
        <p title="${dxCondition.togoKey}">${
          Records.getDatasetLabel(dxCondition.togoKey)
        }</p>
      </div>
      ${
        this.#dxCondition.conditionFilters
          .map(conditionFilter => {
            const label = Records.getAttribute(conditionFilter.attributeId).label;
            return `<div class="condition _catexxxgory-background-color" data-catexxxgory-id="${conditionFilter.catexxxgoryId}">
              <p title="${label}">${label}</p>
            </div>`
          })
          .join('')
      }
      ${
        this.#dxCondition.conditionAnnotations
          .map(conditionAnnotation => {
            return `<div class="condition _catexxxgory-color" data-catexxxgory-id="${conditionAnnotation.catexxxgoryId}">
              <p title="${conditionAnnotation.label}">${conditionAnnotation.label}</p>
            </div>`;
          })
          .join('')
      }
    </div>
    <div class="status">
      <p>Getting ID list</p>
      <span class="material-icons-outlined -rotating">autorenew</span>
    </div>
    <div class="-border">
    </div>
    <div class="controller">
    </div>
    `;

    // reference
    this.#ROOT = elm;
    this.#STATUS = elm.querySelector(':scope > .status > p');

    this.#progressIndicator = new ProgressIndicator(
      elm.querySelector(':scope > .status + div')
    );

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
    this.#ROOT
      .querySelector(':scope > .close-button-view')
      .addEventListener('click', e => {
        this.#deleteCondition(e);
      });

    ConditionBuilder.finish();
    this.select();
    this.#ROOT.classList.toggle('-fetching');
    this.#getQueryIds();
  }

  /* private methods */
  #deleteCondition(e) {
    e.stopPropagation();
    const customEvent = new CustomEvent(event.deleteTableData, {
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
        timeStamp.toISOString().slice(0, 10).replaceAll('-',''),
        timeStamp.toLocaleTimeString().replaceAll(':', ''),
      ];
      anchor.setAttribute('download', `togodx-${date}-${time}.${urlType}`);
    }
  }

  /**
   * @param { MouseEvent } e
   */
  #dataButtonPauseOrResume(e) {
    e.stopPropagation();
    this.#ROOT.classList.toggle('-fetching');
    this.#STATUS.classList.toggle('-flickering');

    const modeToChangeTo = this.#isLoading ? 'resume' : 'pause';
    this.#updateDataButton(
      e.currentTarget,
      dataButtonModes.get(modeToChangeTo)
    );
    this.#isLoading = !this.#isLoading;
    this.#STATUS.textContent = this.#isLoading ? 'Getting data' : 'Awaiting';

    if (this.#isLoading) this.#getProperties();
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
      const conditionFilter = this.#dxCondition.conditionFilters.find(conditionFilter => conditionFilter.attributeId === id);
      const nodes = [];
      if (conditionFilter) nodes.push(...conditionFilter.nodes);
      ConditionBuilder.setFilter(id, nodes, false);
    });
  }

  #dataButtonRetry() {
    this.#STATUS.classList.remove('-error');
    this.#ROOT.classList.toggle('-fetching');
    this.#updateDataButton(this.#BUTTON_LEFT, dataButtonModes.get('empty'));

    const partiallyLoaded = this.#queryIds.length > 0;
    const message = partiallyLoaded ? 'Getting data' : 'Getting ID list';
    this.#STATUS.textContent = message;

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

      case 'resume':
      case 'pause':
        this.#dataButtonPauseOrResume(e);
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
    const jsonBlob = new Blob([JSON.stringify(this.#rows, null, 2)], {
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
      ...this.#rows.map(row => {
        return row.attributes.map(attribute => {
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
        }).flat();
      }).flat()
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
    this.#STATUS.classList.add('-error');
    this.#STATUS.textContent = code ? `${message} (${code})` : message;
    this.#ROOT.classList.toggle('-fetching');

    const customEvent = new CustomEvent(event.failedFetchTableDataIds, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  #getQueryIds() {
    axios
      .post(
        App.getApiUrl('aggregate'),
        getApiParameter('aggregate', {
          dataset: this.#dxCondition.togoKey,
          filters: this.#dxCondition.queryFilters,
          queries: ConditionBuilder.userIds
        }),
        {cancelToken: this.#source.token}
      )
      .then(response => {

        this.#queryIds = response.data;

        if (this.#queryIds.length <= 0) {
          this.#complete(false);
          return;
        }
        this.#ROOT.dataset.status = 'load rows';
        this.#STATUS.textContent = 'Getting data';
        this.#progressIndicator.setIndicator(undefined, this.#queryIds.length);
        this.#updateDataButton(this.#BUTTON_LEFT, dataButtonModes.get('pause'));
        this.#getProperties();
      })
      .catch(error => {
        console.error(error)
        this.#handleError(error);
      });
  }

  #getProperties() {
    this.#isLoading = true;
    const startTime = Date.now();
    axios
      .post(
        App.getApiUrl('dataframe'),
        getApiParameter('dataframe', {
          dataset: this.#dxCondition.togoKey,
          filters: this.#dxCondition.queryFilters,
          annotations: this.#dxCondition.queryAnnotations,
          queries: this.#queryIds.slice(this.offset, this.offset + LIMIT)
        }),
        {cancelToken: this.#source.token}
      )
      .then(response => {
        const offset = this.offset;
        this.#rows.push(...response.data);
        this.#isCompleted = this.offset >= this.#queryIds.length;
        this.#progressIndicator.updateProgressBar({
          offset: this.offset,
          startTime,
        });

        // dispatch event
        const customEvent2 = new CustomEvent(event.addNextRows, {
          detail: {
            tableData: this,
            offset,
            rows: response.data,
            done: this.#isCompleted,
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent2);
        // turn off after finished
        if (this.#isCompleted) {
          this.#complete();
          return;
        }
        if (this.#isLoading) this.#getProperties();
      })
      .catch(error => {
        this.#handleError(error);
      });
  }

  /**
   * @param { boolean } withData
   */
  #complete(withData = true) {
    this.#ROOT.dataset.status = 'complete';
    this.#STATUS.textContent = withData ? 'Complete' : 'No Data Found';
    this.#ROOT.classList.remove('-fetching');
    this.#STATUS.classList.remove('-flickering');

    if (withData) this.#setDownloadButtons();
  }

  /* public methods */
  select() {
    this.#ROOT.classList.add('-current');
    // dispatch event
    const customEvent1 = new CustomEvent(event.selectTableData, {detail: this});
    DefaultEventEmitter.dispatchEvent(customEvent1);
    // send rows
    if (this.#ROOT.dataset.status !== 'load ids') {
      const done = this.offset >= this.#queryIds.length;
      const customEvent2 = new CustomEvent(event.addNextRows, {
        detail: {
          tableData: this,
          rows: this.#rows,
          done,
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

  /* public accessors */
  get offset() {
    return this.#rows.length;
  }
  get togoKey() {
    return this.#dxCondition.togoKey;
  }
  get dxCondition() {
    return this.#dxCondition;
  }
  get data() {
    return this.#rows;
  }
  get rateOfProgress() {
    return this.#rows.length / this.#queryIds.length;
  }
}
