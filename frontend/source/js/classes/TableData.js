import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilder from "./ConditionBuilder";
import Records from "./Records";
import * as event from '../events';

const LIMIT = 100;

export default class TableData {

  #condition;
  #serializedHeader;
  #queryIds;
  #rows;
  #abortController;
  #isAutoLoad;
  #isLoaded;
  #startTime;
  #ROOT;
  #STATUS;
  #INDICATOR_TEXT_AMOUNT;
  #INDICATOR_TEXT_TIME;
  #INDICATOR_BAR;
  #BUTTON_PREPARE_DATA;
  #BUTTON_DOWNLOAD_JSON;
  #BUTTON_DOWNLOAD_TSV;

  constructor(condition, elm) {
    console.log(condition)

    this.#isAutoLoad = false;
    this.#isLoaded = false;
    this.#condition = condition;
    this.#serializedHeader = [
      ...condition.attributes.map(property => property.query.propertyId),
      ...condition.properties.map(property => property.query.propertyId)
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
        <p title="${condition.togoKey}">${Records.getLabelFromTogoKey(condition.togoKey)}</p>
      </div>
      ${condition.attributes.map(property => `<div class="condiiton -value" style="background-color: hsl(${property.subject.hue}, 45%, 50%)">
        <p title="${property.property.label}">${property.property.label}</p>
      </div>`).join('')}
      ${condition.properties.map(property => `<div class="condiiton -value" style="color: hsl(${property.subject.hue}, 45%, 50%)">
        <p title="${property.property.label}">${property.property.label}</p>
      </div>`).join('')}
    </div>
    <div class="status">
      <p>Getting id list</p>
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
      <div class="button" data-button="prepare-data">
        <span class="material-icons-outlined">autorenew</span>
        <span class="label">Prepare data</span>
      </div>
      <div class="button" data-button="download-json">
        <a class="json" href="" download="sample.json">
          <span class="material-icons-outlined">download json</span>
          <span class="label">JSON</span>
        </a>
      </div>
      <div class="button" data-button="download-tsv">
        <a class="tsv" href="" download="sample.tsv">
          <span class="material-icons-outlined">download tsv</span>
          <span class="label">TSV</span>
        </a>
      </div>
      <div class="button" data-button="restore">
        <span class="material-icons-outlined">settings_backup_restore</span>
        <span class="label">Edit</span>
      </div>
    </div>
    `;

    // reference　
    this.#ROOT = elm;
    this.#STATUS = elm.querySelector(':scope > .status > p');
    const INDICATOR = elm.querySelector(':scope > .indicator');
    this.#INDICATOR_TEXT_AMOUNT = INDICATOR.querySelector(':scope > .text > .amount-of-data');
    this.#INDICATOR_TEXT_TIME = INDICATOR.querySelector(':scope > .text > .remaining-time');
    this.#INDICATOR_BAR = INDICATOR.querySelector(':scope > .progress > .bar');
    const BUTTONS = [...elm.querySelectorAll(':scope > .controller > .button')];
    this.#BUTTON_PREPARE_DATA = BUTTONS.find(button => button.dataset.button === 'prepare-data');
    this.#BUTTON_DOWNLOAD_JSON = BUTTONS.find(button => button.dataset.button === 'download-json');
    this.#BUTTON_DOWNLOAD_TSV = BUTTONS.find(button => button.dataset.button === 'download-tsv');

    // events
    elm.addEventListener('click', () => {
      if (elm.classList.contains('-current')) return;
      this.select();
    });
    // prepare data
    this.#BUTTON_PREPARE_DATA.addEventListener('click', e => {
      e.stopPropagation();
      if (this.#isAutoLoad === false && this.#ROOT.dataset.status !== 'complete') {
        this.#autoLoad();
        this.#BUTTON_PREPARE_DATA.classList.add('-rotating');
        this.#BUTTON_PREPARE_DATA.querySelector(':scope > .label').innerHTML = 'Pause';
      } else {
        this.#isAutoLoad = false;
        this.#BUTTON_PREPARE_DATA.classList.remove('-rotating');
        this.#BUTTON_PREPARE_DATA.querySelector(':scope > .label').innerHTML = 'Resume';
      }
    });
    // delete
    this.#ROOT.querySelector(':scope > .close-button-view').addEventListener('click', e => {
      e.stopPropagation();
      const customEvent = new CustomEvent(event.deleteTableData, {detail: this});
      DefaultEventEmitter.dispatchEvent(customEvent);
      // abort fetch
      this.#abortController.abort();
      // delete element
      this.#ROOT.parentNode.removeChild(this.#ROOT);
      // transition
      document.querySelector('body').dataset.display = 'properties';
    });
    // restore
    BUTTONS.find(button => button.dataset.button === 'restore').addEventListener('click', e => {
      e.stopPropagation();
      // property (attribute)
      console.log(this.#condition)
      ConditionBuilder.setProperties(this.#condition.properties.map(property => {
        return {
          subject: property.subject,
          property: property.property
        }
      }));
      // attribute (classification/distribution)
      Records.properties.forEach(property => {
        const attribute = this.#condition.attributes.find(attribute => attribute.property.propertyId === property.propertyId);
        let subject, values = [];
        if (attribute) {
          subject = attribute.subject;
          values = attribute.query.categoryIds.map(categoryId => {
            return {
              categoryId: categoryId,
              label: Records.getValue(attribute.query.propertyId, categoryId).label,
              ancestors: []
            }
          });
        } else {
          subject = Records.getSubject(property.subjectId);
        }
        ConditionBuilder.setPropertyValues({subject, property, values});
      });
    });
    this.select();
    this.#getQueryIds();
  }
  

  /* private methods */


  #getQueryIds() {
    // reset
    this.#abortController = new AbortController();
    this.#ROOT.classList.add('-fetching');
    fetch(
      `${App.aggregatePrimaryKeys}?togoKey=${this.#condition.togoKey}&properties=${encodeURIComponent(JSON.stringify(this.#condition.attributes.map(property => property.query)))}${ConditionBuilder.userIds ? `&inputIds=${encodeURIComponent(JSON.stringify(ConditionBuilder.userIds.split(',')))}` : ''}`,
      {
        signal: this.#abortController.signal
      })
      .catch(error => {
        throw Error(error);
      })
      .then(responce => {
        if (responce.ok) {
          return responce
        };
        this.#STATUS.classList.add('-error');
        this.#STATUS.textContent = `${responce.status} (${responce.statusText})`;
        throw Error(responce);
      })
      .then(responce => responce.json())
      .then(queryIds => {
        console.log(queryIds)
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
        console.error(error)
        const customEvent = new CustomEvent(event.failedFetchTableDataIds, {detail: this});
        DefaultEventEmitter.dispatchEvent(customEvent);
      })
      .finally(() => {
        this.#ROOT.classList.remove('-fetching');
      });
  }

  #getProperties() {
    this.#ROOT.classList.add('-fetching');
    this.#STATUS.textContent = 'Getting data';
    fetch(
      `${App.aggregateRows}?togoKey=${this.#condition.togoKey}&properties=${encodeURIComponent(JSON.stringify(this.#condition.attributes.map(property => property.query).concat(this.#condition.properties.map(property => property.query))))}&queryIds=${encodeURIComponent(JSON.stringify(this.#queryIds.slice(this.offset, this.offset + LIMIT)))}`,
      {
        signal: this.#abortController.signal
      })
      .then(responce => responce.json())
      .then(rows => {
        console.log(rows)
        this.#rows.push(...rows);
        this.#isLoaded = this.offset >= this.#queryIds.length;
        // display
        this.#ROOT.classList.remove('-fetching');
        this.#STATUS.textContent = 'Awaiting';
        this.#INDICATOR_TEXT_AMOUNT.innerHTML = `${this.offset.toLocaleString()} / ${this.#queryIds.length.toLocaleString()}`;
        this.#INDICATOR_BAR.style.width = `${(this.offset / this.#queryIds.length) * 100}%`;
        this.#updateRemainingTime();
        // dispatch event
        const customEvent = new CustomEvent(event.addNextRows, {detail: {
          tableData: this,
          rows,
          done: this.#isLoaded
        }});
        DefaultEventEmitter.dispatchEvent(customEvent);
        // turn off after finished
        if (this.#isLoaded) {
          this.#complete();
        } else if (this.#isAutoLoad) {
          this.#getProperties();
        }
      })
      .catch(error => {
        this.#ROOT.classList.remove('-fetching');
        console.error(error) // TODO:
      });
  };
  
  #updateRemainingTime() {
    let singleTime = (Date.now() - this.#startTime) / this.offset; 
    let remainingTime;
    if (this.offset == 0) {
      remainingTime = '';
    } else if (this.offset >= this.#queryIds.length) {
      remainingTime = 0;
    } else {
      remainingTime = singleTime * this.#queryIds.length * (this.#queryIds.length - this.offset) / this.#queryIds.length / 1000;
    }
    if (remainingTime >= 3600) {
      this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.round(remainingTime / 3600)} hr.`;
    } else if (remainingTime >= 60) {
      this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.round(remainingTime / 60)} min.`;
    } else if (remainingTime >= 0) {
      this.#INDICATOR_TEXT_TIME.innerHTML = `${Math.floor(remainingTime)} sec.`;
    } else {
      this.#INDICATOR_TEXT_TIME.innerHTML = ``;
    }
  };
  
  #autoLoad() {
    if (this.#isLoaded) return;
    this.#isAutoLoad = true;
    this.#ROOT.classList.add('-autoload');
    this.#getProperties();
  }

  #complete() {
    this.#ROOT.dataset.status = 'complete';
    this.#STATUS.textContent = 'Complete';
    this.#BUTTON_PREPARE_DATA.classList.add('-rotating');
    console.log(this.#rows);
    const jsonBlob = new Blob([JSON.stringify(this.#rows, null, 2)], {type : 'application/json'});
    const jsonUrl = URL.createObjectURL(jsonBlob);
    console.log(jsonUrl)
    this.#BUTTON_DOWNLOAD_JSON.querySelector(':scope > .json').setAttribute('href', jsonUrl);
    // tsv
    let jsonArray = [];
    this.#rows.map(item => {
      let singleBox;
      singleBox = {
        togokey: this.#condition.togoKey,
        togokeyId: item.id,
        attribute: item.properties[0].propertyId,
        attributeKey: item.properties[0].propertyKey,
        attributeId: item.properties[0].attributes[0].attribute.categoryId,
        attribute_label: item.properties[0].attributes[0].attribute.label
      }
      jsonArray.push(singleBox);
    })
    console.log(jsonArray);
    let tsv = [];
    tsv.push(Object.keys(jsonArray[0]) + "\n");
    jsonArray.map(item => {
      tsv.push(Object.values(item) + '\n');
    })
    console.log(tsv);
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const tsvBlob = new Blob([tsv.join('\t')], { type: 'text/plain' });
    let tsvUrl = URL.createObjectURL(tsvBlob);
    this.#BUTTON_DOWNLOAD_TSV.querySelector(':scope > .tsv').setAttribute('href', tsvUrl);
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
      const customEvent2 = new CustomEvent(event.addNextRows, {detail: {
        tableData: this, 
        rows: this.#rows,
        done
      }});
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