import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";
import ConditionBuilder from "./ConditionBuilder";
import * as event from '../events';
import Records from "./Records";

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
  #BUTTON_PREPARE_DOWNLOAD;
  #BUTTON_START_DOWNLOAD;

  constructor(condition, elm) {
    console.log(condition)
    console.log(ConditionBuilder)

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
    <div class="conditions">
      <div class="condiiton">
        <p title="${condition.togoKey}">${condition.togoKey}</p>
      </div>
      ${condition.attributes.map(property => `<div class="condiiton -value" style="background-color: hsl(${property.subject.hue}, 45%, 50%)">
        <p title="${property.property.label}">${property.property.label}</p>
      </div>`).join('')}
      ${condition.properties.map(property => `<div class="condiiton -value" style="color: hsl(${property.subject.hue}, 45%, 50%)">
        <p title="${property.property.label}">${property.property.label}</p>
      </div>`).join('')}
      
    </div>
    <div class="button close-button-view" title="Delete" data-button="delete"></div>
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
      <div class="button autorenew" title="Prepare for download" data-button="prepare-download">
        <span class="material-icons-outlined autorenew">autorenew</span><span class="prepare-pause-resume">Prepare Data</span>
      </div>
      <div class="button downloads" title="Download JSON " data-button="start-download">
        <a class="json" href="" download="sample.json">
          <span class="material-icons-outlined">download</span>
          <span class="text">JSON</span>
        </a>
      </div>
      <div class="button" title="Restore as condition" data-button="restore">
        <span class="material-icons-outlined">settings_backup_restore</span><span>Edit</span>
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
    this.#BUTTON_PREPARE_DOWNLOAD = BUTTONS.find(button => button.dataset.button === 'prepare-download');
    this.#BUTTON_START_DOWNLOAD = BUTTONS.find(button => button.dataset.button === 'start-download');

    // events
    elm.addEventListener('click', () => {
      if (elm.classList.contains('-current')) return;
      this.select();
    });
    this.#BUTTON_PREPARE_DOWNLOAD.addEventListener('click', e => {
      e.stopPropagation();
      if (this.#isAutoLoad == false && this.#ROOT.dataset.status != 'complete') {
        this.#isAutoLoad == true;
        this.#autoLoad();
        this.#BUTTON_PREPARE_DOWNLOAD.querySelector(':scope > .autorenew').classList.add('lotation');
        this.#BUTTON_PREPARE_DOWNLOAD.querySelector(':scope > .prepare-pause-resume').innerHTML='Pause';
      } else {
        this.#isAutoLoad = false;
        this.#BUTTON_PREPARE_DOWNLOAD.querySelector(':scope > .autorenew').classList.remove('lotation');
        this.#BUTTON_PREPARE_DOWNLOAD.querySelector(':scope > .prepare-pause-resume').innerHTML='Resume';
      }
    });
    // delete button
    // BUTTONS.find(button => button.dataset.button === 'delete').addEventListener('click', e => {
    //   e.stopPropagation();
    //   console.log('delete')
    //   const element = document.querySelector('.table-data-controller-view');
    //   element.parentNode.removeChild(element)
    // });
    BUTTONS.find(button => button.dataset.button === 'restore').addEventListener('click', e => {
      e.stopPropagation();
      console.log('restore');
      this.#condition.attributes.forEach (attribute => {
        ConditionBuilder.setPropertyValues({
          subject: attribute.subject,
          property: attribute.property,
          values: attribute.query.categoryIds.map(categoryId => {
            console.log(Records.getValue(attribute.query.propertyId, categoryId));
            return {
              categoryId: categoryId,
              label: Records.getValue(attribute.query.propertyId, categoryId).label,
              ancestors: []
            }
          })
        });
      })
      this.#condition.properties.forEach (property => {
        ConditionBuilder.setPropertyValues({
          subject: property.subject,
          property: property.property,
          values: [{
          }]
        });
      })
    })
    this.select();
    this.#getQueryIds();
  }
  

  /* private methods */


  #getQueryIds() {
    // reset
    this.#abortController = new AbortController();
    this.#ROOT.classList.add('-fetching');
    console.log(ConditionBuilder.userIds)
    fetch(
      `${App.aggregatePrimaryKeys}?togoKey=${this.#condition.togoKey}&properties=${encodeURIComponent(JSON.stringify(this.#condition.attributes.map(property => property.query)))}${ConditionBuilder.userIds ? `&inputIds=${encodeURIComponent(JSON.stringify(ConditionBuilder.userIds.split(',')))}` : ''}`,
      {
        signal: this.#abortController.signal
      })
      .catch(error => {
        throw Error(error);
      })
      .then(responce => {
        console.log(responce);
        if (responce.ok) {
          return responce
        };
        this.#STATUS.classList.add('-error');
        this.#STATUS.textContent = `${responce.status} (${responce.statusText})`;
        throw Error(responce);
      })
      .then(responce => {
        // const reader = responce.body.getReader();
        // console.log(reader);
        return responce.json();
      })
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
    this.#BUTTON_PREPARE_DOWNLOAD.querySelector(':scope > .autorenew').classList.add('lotation');
    const jsonBlob = new Blob([JSON.stringify(this.#rows, null, 2)], {type : 'application/json'});
    const jsonUrl = URL.createObjectURL(jsonBlob);
    this.#BUTTON_START_DOWNLOAD.querySelector(':scope > .json').setAttribute('href', jsonUrl);
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