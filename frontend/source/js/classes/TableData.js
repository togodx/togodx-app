import App from "./App";
import DefaultEventEmitter from "./DefaultEventEmitter";

const LIMIT = 10;

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
    <div class="button close-button" title="Delete" data-button="delete"></div>
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
        <span class="material-icons-outlined" id="autorenew">autorenew</span>
      </div>
      <div class="button downloads" title="Download CSV">
        <span class="material-icons-outlined">download</span>
        CSV
      </div>
      <div class="button downloads" title="Download JSON ">
        <span class="material-icons-outlined">download</span>
        JSON
      </div>
      <div class="button" title="Restore as condition" data-button="restore">
        <span class="material-icons-outlined">settings_backup_restore</span>
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
    const BUTTONS = [...elm.querySelectorAll('.button')];
    this.#BUTTON_PREPARE_DOWNLOAD = BUTTONS.find(button => button.dataset.button === 'prepare-download');

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
        document.getElementById('autorenew').classList.add('lotation');
      } else {
        this.#isAutoLoad = false;
        document.getElementById('autorenew').classList.remove('lotation');
      }
    });
    BUTTONS.find(button => button.dataset.button === 'restore').addEventListener('click', e => {
      e.stopPropagation();
      console.log('restore')
    });
    BUTTONS.find(button => button.dataset.button === 'delete').addEventListener('click', e => {
      e.stopPropagation();
      console.log('delete')
      let element = document.querySelector('.table-data-controller-view');
      element.parentNode.removeChild(element)
      console.log('実行',element.parentNode.removeChild(element));
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
      `${App.aggregatePrimaryKeys}?togoKey=${this.#condition.togoKey}&properties=${encodeURIComponent(JSON.stringify(this.#condition.attributes.map(property => property.query)))}`,
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
        const event = new CustomEvent('failedFetchTableDataIds', {detail: this});
        DefaultEventEmitter.dispatchEvent(event);
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
        const event = new CustomEvent('addNextRows', {detail: {
          tableData: this,
          rows,
          done: this.#isLoaded
        }});
        DefaultEventEmitter.dispatchEvent(event);
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
    document.getElementById('autorenew').classList.remove('lotation');
  }

  /* public methods */

  select() {
    this.#ROOT.classList.add('-current');
    // dispatch event
    const event1 = new CustomEvent('selectTableData', {detail: this});
    DefaultEventEmitter.dispatchEvent(event1);
    // send rows
    if (this.#ROOT.dataset.status !== 'load ids') {
      const done = this.offset >= this.#queryIds.length;
      const event2 = new CustomEvent('addNextRows', {detail: {
        tableData: this, 
        rows: this.#rows,
        done
      }});
      DefaultEventEmitter.dispatchEvent(event2);
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