import App from './App';
import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import * as event from '../events';
import ProgressIndicator from './ProgressIndicator';

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
  #condition;
  #dxCondition;
  #serializedHeader;
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

  constructor(condition, dxCondition, elm) {
    console.log(condition)
    console.log(dxCondition)
    const CancelToken = axios.CancelToken;
    this.#source = CancelToken.source();

    this.#isLoading = false;
    this.#isCompleted = false;
    this.#condition = condition;
    this.#dxCondition = dxCondition;
    this.#serializedHeader = [
      ...dxCondition.valuesConditions.map(valuesCondition => valuesCondition.propertyId),
      ...dxCondition.keyConditions.map(keyCondition => keyCondition.propertyId),
    ];
    console.log(this.#serializedHeader)
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
        this.#dxCondition.valuesConditions
          .map(valuesCondition => {
            const label = Records.getProperty(valuesCondition.propertyId).label;
            return `<div class="condition _subject-background-color" data-subject-id="${valuesCondition.key.subjectId}">
              <p title="${label}">${label}</p>
            </div>`
          })
          .join('')
      }
      ${
        this.#dxCondition.keyConditions
          .map(keyCondition => {
            return `<div class="condition _subject-color" data-subject-id="${keyCondition.key.subjectId}">
              <p title="${keyCondition.label}">${keyCondition.label}</p>
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
    ConditionBuilder.setProperties(
      this.#dxCondition.keyConditions.map(keyCondition => {
        return {
          propertyId: keyCondition.propertyId,
          parentCategoryId: keyCondition.parentCategoryId,
        }
      }),
      false
    );
    // attribute (classification/distribution)
    Records.properties.forEach(({propertyId}) => {
      const valuesCondition = this.#dxCondition.valuesConditions.find(valuesCondition => valuesCondition.propertyId === propertyId);
      // const attribute = this.#condition.attributes.find(
      //   attribute => attribute.property.propertyId === propertyId
      // );
      const categoryIds = [];
      if (valuesCondition) categoryIds.push(...valuesCondition.categoryIds);
      // if (attribute) categoryIds.push(...attribute.query.categoryIds);
      ConditionBuilder.setPropertyValues(propertyId, categoryIds, false);
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
    const temporaryArray = [];
    this.#rows.forEach(row => {
      row.properties.forEach(property => {
        property.attributes.forEach(attribute => {
          const singleItem = [
            this.#dxCondition.togoKey, // togoKey
            row.id, // togoKeyId
            row.label, // togoKeyLabel
            property.propertyId, // attribute
            property.propertyKey, // attributeKey
            attribute.id, // attributeKeyId
            attribute.attribute.label, // attributeValue
          ];
          temporaryArray.push(singleItem);
        });
      });
    });
    const tsvArray = temporaryArray.map(item => {
      return item.join('\t');
    });
    if (tsvArray.length !== 0) {
      const tsvHeader = [
        'togoKey',
        'togoKeyId',
        'togoKeyLabel',
        'attribute',
        'attributeKey',
        'attributeKeyId',
        'attributeValue',
      ];
      tsvArray.unshift(tsvHeader.join('\t'));
    }
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const tsvBlob = new Blob([bom, tsvArray.join('\n')], {type: 'text/plain'});
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

  #getQueryIdsPayload() {
    return `togoKey=${this.#dxCondition.togoKey}&properties=${encodeURIComponent(
      JSON.stringify(this.#condition.attributes.map(property => property.query))
    )}${
      ConditionBuilder.userIds?.length > 0
        ? `&inputIds=${encodeURIComponent(
            JSON.stringify(ConditionBuilder.userIds.split(','))
          )}`
        : ''
    }`;
  }

  #getQueryIds() {
    axios
      .post(App.aggregatePrimaryKeys, this.#getQueryIdsPayload(), {
        cancelToken: this.#source.token,
      })
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
        this.#handleError(error);
      });
  }

  #getPropertiesFetch() {
    return `${App.aggregateRows}?togoKey=${
      this.#dxCondition.togoKey
    }&properties=${
      encodeURIComponent(
        JSON.stringify(
          this.#condition.attributes
            .map(property => property.query)
            .concat(this.#dxCondition.keyConditions.map(keyCondition => keyCondition.query))
        )
      )
    }&queryIds=${
      encodeURIComponent(
        JSON.stringify(this.#queryIds.slice(this.offset, this.offset + LIMIT))
      )
    }`;
  }

  #getProperties() {
    this.#isLoading = true;
    const startTime = Date.now();
    axios
      .get(this.#getPropertiesFetch(), {cancelToken: this.#source.token})
      .then(response => {
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
  get condition() {
    return this.#condition;
  }
  get serializedHeader() {
    return this.#serializedHeader;
  }
  get data() {
    return this.#rows;
  }
  get rateOfProgress() {
    return this.#rows.length / this.#queryIds.length;
  }
}
