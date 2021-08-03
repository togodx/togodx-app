import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import * as event from '../events';
import * as queryTemplates from '../functions/queryTemplates';
import ProgressIndicator from './ProgressIndicator';
import axiosRetry from 'axios-retry';

const timeOutError = 'ECONNABORTED';

export default class UploadUserIDsView {
  #ROOT;
  #BODY;
  #USER_IDS;
  #progressIndicator;
  #source;
  #offset;
  #errorCount;

  constructor(elm) {
    // TODO: set axios settings in common file
    // TODO: set 'user cancel' as a const in axios setting file
    axios.defaults.timeout = 120000;
    axiosRetry(axios, {
      retries: 5,
      shouldResetTimeout: true,
      retryDelay: retryCount => {
        return Math.pow(2, retryCount - 1) * 5000;
      },
      retryCondition: error => {
        return (error.code === timeOutError) | (error.response?.status === 500);
      },
    });

    this.#ROOT = elm;
    this.#offset = 0;
    this.#errorCount = 0;

    this.#BODY = document.querySelector('body');
    this.#USER_IDS = elm.querySelector(':scope > textarea');

    elm.appendChild(document.createElement('div'));
    this.#progressIndicator = new ProgressIndicator(elm.lastChild, 'simple');

    // attach events
    const buttons = elm.querySelector(':scope > .buttons');
    buttons
      .querySelector(':scope > button:nth-child(1)')
      .addEventListener('click', e => {
        e.stopPropagation();
        // clear after 2nd execution
        if (this.#source) this.#reset(true);
        this.#fetch();
        return false;
      });
    buttons
      .querySelector(':scope > button:nth-child(2)')
      .addEventListener('click', e => {
        e.stopPropagation();
        this.#clear();
        return false;
      });

    // event listeners
    this.#USER_IDS.addEventListener('change', () => {
      ConditionBuilder.setUserIds(this.#USER_IDS.value);
    });
    // this.#USER_IDS.addEventListener('keyup', e => {
    //   if (e.keyCode === 13) this.#fetch();
    // });
    // DefaultEventEmitter.addEventListener(event.restoreParameters, this.#restoreParameters.bind(this));
    DefaultEventEmitter.addEventListener(
      event.clearCondition,
      this.#clear.bind(this)
    );
  }

  // public methods

  // private methods

  // #restoreParameters({detail}) {
  //   this.#USER_IDS.value = detail.userIds;
  // }

  #fetch() {
    if (this.#USER_IDS.value === '') return;
    this.#prepareProgressIndicator();
    Records.properties.forEach(property => {
      this.#getProperty(property);
    });
  }

  #prepareProgressIndicator() {
    // reset axios cancellation
    const CancelToken = axios.CancelToken;
    this.#source = CancelToken.source();

    this.#ROOT.classList.add('-fetching');
    this.#ROOT.dataset.status = '';
    this.#progressIndicator.setIndicator(
      'Mapping your IDs',
      Records.properties.length
    );
  }

  #getProperty({propertyId, data, primaryKey}) {
    axios
      .get(
        queryTemplates.dataFromUserIds(data, primaryKey),
        {cancelToken: this.#source.token}
      )
      .then(response => {
        this.#BODY.classList.add('-showuserids');
        this.#handleProp();

        // dispatch event
        const customEvent = new CustomEvent(event.setUserValues, {
          detail: {
            propertyId,
            values: response.data,
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
      })
      .catch(error => {
        if (axios.isCancel && error.message === 'user cancel') return;
        const customEvent = new CustomEvent(event.toggleErrorUserValues, {
          detail: {
            mode: 'show',
            propertyId,
            message: 'Failed to map this ID',
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
        this.#handleProp();
        this.#errorCount++;
      })
      .then(() => {
        console.log(`error count:${this.#errorCount}`);
        if (this.#offset >= Records.properties.length) {
          this.#complete(this.#errorCount > 0);
        }
      });
  }

  #handleProp() {
    this.#offset += 1;
    this.#progressIndicator.updateProgressBar({
      offset: this.#offset,
    });
  }

  #complete(withError = false) {
    if (withError) {
      this.#progressIndicator.setIndicator(
        `Failed to map IDs for ${this.#errorCount} propert${
          this.#errorCount === 1 ? 'y' : 'ies'
        }`,
        undefined,
        withError
      );
    }
    this.#ROOT.dataset.status = 'complete';
  }

  #resetCounters() {
    this.#offset = 0;
    this.#errorCount = 0;
  }

  #reset(isPreparing = false) {
    this.#source?.cancel('user cancel');
    this.#resetCounters();
    const customEvent = new CustomEvent(event.clearUserValues);
    DefaultEventEmitter.dispatchEvent(customEvent);

    const customEvent2 = new CustomEvent(event.toggleErrorUserValues, {
      detail: {
        mode: 'hide',
      },
    });
    DefaultEventEmitter.dispatchEvent(customEvent2);
    this.#progressIndicator.reset();
    this.#BODY.classList.remove('-showuserids');

    if (isPreparing) return;

    ConditionBuilder.setUserIds();
    this.#USER_IDS.value = '';
  }

  #clear() {
    this.#reset();
    this.#complete();
  }
}
