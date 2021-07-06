import App from './App';
import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import * as event from '../events';

const LIMIT = 100;
const downloadUrls = new Map();
/**
 * @typedef {Object} Mode
 * @property {string} label
 * @property {string} icon
 * @property {string} dataButton
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
      icon: 'home',
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
    'csv',
    {
      label: 'CSV',
      icon: 'download',
      dataButton: 'download-csv',
    },
  ],
]);

export default class TableData {
  #condition;
  #serializedHeader;
  #queryIds;
  #rows;
  #abortController;
  #isAutoLoad;
  #isCompleted;
  #startTime;
  #ROOT;
  #STATUS;
  #INDICATOR_TEXT_AMOUNT;
  #INDICATOR_TEXT_TIME;
  #INDICATOR_BAR;
  #CONTROLLER;
  #BUTTON_LEFT;
  #BUTTON_RIGHT;

  constructor(condition, elm) {
    // console.log(condition);

    this.#isAutoLoad = false;
    this.#isCompleted = false;
    this.#condition = condition;
    this.#serializedHeader = [
      ...condition.attributes.map(property => property.query.propertyId),
      ...condition.properties.map(property => property.query.propertyId),
    ];
    this.#queryIds = [];
    this.#rows = [];

    // view
    elm.classList.add('table-data-controller-view');
    elm.dataset.status = 'load ids';

    elm.innerHTML = `
    <div class="close-button-view"></div>
    <div class="conditions">
      <div class="condiiton">
        <p title="${condition.togoKey}">${Records.getLabelFromTogoKey(
      condition.togoKey
    )}</p>
      </div>
      ${condition.attributes
        .map(
          property => `<div class="condiiton _subject-background-color" data-subject-id="${property.subject.subjectId}">
        <p title="${property.property.label}">${property.property.label}</p>
      </div>`
        )
        .join('')}
      ${condition.properties
        .map(property => {
          const label = property.parentCategoryId
            ? Records.getValue(
                property.query.propertyId,
                property.parentCategoryId
              ).label
            : property.property.label;
          return `<div class="condiiton _subject-color" data-subject-id="${property.subject.subjectId}">
          <p title="${label}">${label}</p>
        </div>`;
        })
        .join('')}
    </div>
    <div class="status">
      <p>Getting ID list</p>
    </div>
    <div class="indicator">
      <div class="text">
        <div class="amount-of-data"></div>
        <div class="remaining-time"></div>
      </div>
      <div class="progress">
        <div class="bar"></div>
      </div>
    </div>
    <div class="controller">

    </div>
    `;

    // reference
    this.#ROOT = elm;
    this.#STATUS = elm.querySelector(':scope > .status > p');
    const INDICATOR = elm.querySelector(':scope > .indicator');
    this.#INDICATOR_TEXT_AMOUNT = INDICATOR.querySelector(
      ':scope > .text > .amount-of-data'
    );
    this.#INDICATOR_TEXT_TIME = INDICATOR.querySelector(
      ':scope > .text > .remaining-time'
    );
    this.#INDICATOR_BAR = INDICATOR.querySelector(':scope > .progress > .bar');

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

    DefaultEventEmitter.addEventListener(event.buttonEventByMode, e => {
      this.#dataButtonEvent(e);
    });

    // delete
    this.#ROOT
      .querySelector(':scope > .close-button-view')
      .addEventListener('click', this.#deleteCondition.bind(this));

    ConditionBuilder.finish();
    this.select();
    this.#getQueryIds();
  }

  /* private methods */

  #deleteCondition() {
    e.stopPropagation();
    const customEvent = new CustomEvent(event.deleteTableData, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
    // abort fetch
    this.#abortController.abort();
    // delete element
    this.#ROOT.parentNode.removeChild(this.#ROOT);
    // transition
    document.querySelector('body').dataset.display = 'properties';
  }

  #getQueryIds() {
    // reset
    this.#abortController = new AbortController();
    this.#ROOT.classList.add('-fetching');
    fetch(
      `${App.aggregatePrimaryKeys}?togoKey=${
        this.#condition.togoKey
      }&properties=${encodeURIComponent(
        JSON.stringify(
          this.#condition.attributes.map(property => property.query)
        )
      )}${
        ConditionBuilder.userIds?.length > 0
          ? `&inputIds=${encodeURIComponent(
              JSON.stringify(ConditionBuilder.userIds)
            )}`
          : ''
      }`,
      {
        signal: this.#abortController.signal,
      }
    )
      .catch(error => {
        throw Error(error);
      })
      .then(responce => {
        if (responce.ok) {
          return responce;
        }
        this.#STATUS.classList.add('-error');
        this.#STATUS.textContent = `${responce.status} (${responce.statusText})`;
        throw Error(responce);
      })
      .then(responce => responce.json())
      .then(queryIds => {
        // console.log(queryIds);
        this.#queryIds = queryIds;
        // display
        this.#ROOT.dataset.status = 'load rows';
        this.#STATUS.textContent = '';
        this.#INDICATOR_TEXT_AMOUNT.innerHTML = `${this.offset.toLocaleString()} / ${this.#queryIds.length.toLocaleString()}`;
        this.#startTime = Date.now();
        this.#getProperties();
      })
      .catch(error => {
        // TODO:
        console.error(error);
        const customEvent = new CustomEvent(event.failedFetchTableDataIds, {
          detail: this,
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
      })
      .finally(() => {
        this.#ROOT.classList.remove('-fetching');
      });
  }
  // *** Responsive Buttons based on dataButtonModes ***
  /**
   * @param {string} className
   * @param {Mode} mode
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
      const customEvent = new CustomEvent(event.buttonEventByMode, {
        detail: className,
      });
      DefaultEventEmitter.dispatchEvent(customEvent);
    });

    return button;
  }

  /**
   * @param {HTMLElement} target
   * @param {Mode} mode
   */

  #updateDataButton(target, mode) {
    target.dataset.button = mode.dataButton;
    target.querySelector('a > .material-icons-outlined').innerText = mode.icon;
    target.querySelector('a > .label').innerText = mode.label;
  }

  // Button events by Mode
  #dataButtonPauseOrResume() {
    e.stopPropagation();
    this.#autoLoad
      ? this.#updateDataButton(this.#BUTTON_LEFT, dataButtonModes.get('resume'))
      : this.#updateDataButton(this.#BUTTON_LEFT, dataButtonModes.get('pause'));
    this.#isAutoLoad = !this.#isAutoLoad;
  }

  #dataButtonEdit(e) {
    e.stopPropagation();
    // property (attribute)
    ConditionBuilder.setProperties(
      this.#condition.properties.map(property => {
        return {
          propertyId: property.query.propertyId,
          parentCategoryId: property.parentCategoryId,
        };
      }),
      false
    );
    // attribute (classification/distribution)
    Records.properties.forEach(({propertyId}) => {
      const attribute = this.#condition.attributes.find(
        attribute => attribute.property.propertyId === propertyId
      );
      const categoryIds = [];
      if (attribute) categoryIds.push(...attribute.query.categoryIds);
      ConditionBuilder.setPropertyValues(propertyId, categoryIds, false);
    });
  }
  /**
   * @param { string } type
   * @param { HTMLElement } parent
   */

  #dataButtonDownload(parent, type) {
    const url = downloadUrls.get(type);
    const anchor = parent.querySelector(':scope > a');
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', `sample.${type}`);
    anchor.click();
  }

  /**
   * @param { string } buttonType
   */

  // If not neccesary, only use e.detail
  #dataButtonEvent(e) {
    const button = this.#CONTROLLER.querySelector(`.${e.detail}`);
    const mode = button.dataset.button;
    switch (mode) {
      case 'edit':
        this.#dataButtonEdit.bind(this);
        break;

      case 'resume':
      case 'pause':
        this.#dataButtonPauseOrResume.bind(this);
        break;

      case 'tsv':
      case 'csv':
        this.#dataButtonDownload(button, mode);
        break;
    }
  }

  #getProperties() {
    this.#isAutoLoad = true;
    this.#updateDataButton(this.#BUTTON_LEFT, dataButtonModes.get('pause'));
    this.#ROOT.classList.add('-fetching');
    this.#STATUS.textContent = 'Getting Data';
    fetch(
      `${App.aggregateRows}?togoKey=${
        this.#condition.togoKey
      }&properties=${encodeURIComponent(
        JSON.stringify(
          this.#condition.attributes
            .map(property => property.query)
            .concat(this.#condition.properties.map(property => property.query))
        )
      )}&queryIds=${encodeURIComponent(
        JSON.stringify(this.#queryIds.slice(this.offset, this.offset + LIMIT))
      )}`,
      {
        signal: this.#abortController.signal,
      }
    )
      .then(responce => responce.json())
      .then(rows => {
        this.#rows.push(...rows);
        this.#isCompleted = this.offset >= this.#queryIds.length;
        // display
        this.#ROOT.classList.remove('-fetching');
        this.#STATUS.textContent = 'Awaiting';
        this.#INDICATOR_TEXT_AMOUNT.innerHTML = `${this.offset.toLocaleString()} / ${this.#queryIds.length.toLocaleString()}`;
        this.#INDICATOR_BAR.style.width = `${
          (this.offset / this.#queryIds.length) * 100
        }%`;
        this.#updateRemainingTime();
        // dispatch event
        const customEvent = new CustomEvent(event.addNextRows, {
          detail: {
            tableData: this,
            rows,
            done: this.#isCompleted,
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
        // turn off after finished
        if (this.#isCompleted) {
          this.#complete();
          this.#updateDataButton(
            this.#BUTTON_LEFT,
            dataButtonModes.get('json')
          );
          const secondButton = this.#makeDataButton('middle', 'download-csv');
          this.#CONTROLLER.appendChild(secondButton);
        } else if (this.#isAutoLoad) {
          this.#getProperties();
        }
      })
      .catch(error => {
        this.#ROOT.classList.remove('-fetching');
        console.error(error); // TODO:
      });
  }

  #updateRemainingTime() {
    let singleTime = (Date.now() - this.#startTime) / this.offset;
    let remainingTime;
    if (this.offset == 0) {
      remainingTime = '';
    } else if (this.offset >= this.#queryIds.length) {
      remainingTime = 0;
    } else {
      remainingTime =
        (singleTime *
          this.#queryIds.length *
          (this.#queryIds.length - this.offset)) /
        this.#queryIds.length /
        1000;
    }
    if (remainingTime >= 3600) {
      this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.round(
        remainingTime / 3600
      )} hr.`;
    } else if (remainingTime >= 60) {
      this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.round(
        remainingTime / 60
      )} min.`;
    } else if (remainingTime >= 0) {
      this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.floor(remainingTime)} sec.`;
    } else {
      this.#INDICATOR_TEXT_TIME.innerHTML = ``;
    }
  }

  #autoLoad() {
    if (this.#isCompleted) return;
    this.#isAutoLoad = true;
    this.#ROOT.classList.add('-autoload');
    this.#getProperties();
  }

  #complete() {
    this.#ROOT.dataset.status = 'complete';
    this.#STATUS.textContent = 'Complete';
    this.#setJsonUrl();
    this.#setTsvUrl();
  }

  // Setters for downloadUrls
  #setJsonUrl() {
    const jsonBlob = new Blob([JSON.stringify(this.#rows, null, 2)], {
      type: 'application/json',
    });
    downloadUrls.set('json', jsonBlob);
  }

  // TODO: look at possible improvements looping
  #setTsvUrl() {
    const temporaryArray = [];
    this.#rows.forEach(row => {
      row.properties.forEach(property => {
        property.attributes.forEach(attribute => {
          const singleItem = [
            this.#condition.togoKey, // togoKey
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
    if (this.#isAutoLoad) return;
    this.#getProperties();
  }

  /* public accessors */

  get offset() {
    return this.#rows.length;
  }
  get togoKey() {
    return this.condition.togoKey;
  }
  get subjectId() {
    return this.condition.subjectId;
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
