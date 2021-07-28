import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import * as event from '../events';
import ProgressIndicator from './ProgressIndicator';
import axiosRetry from 'axios-retry';

const timeOutError = 'ECONNABORTED';

export default class UploadUserIDsView {
  #path;
  #ROOT;
  #BODY;
  #USER_IDS;
  #progressIndicator;
  #source;
  #offset;
  #errorCount;

  constructor(elm) {
    // TODO: set axios settings in common file
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
    this.#progressIndicator = new ProgressIndicator(elm.lastChild, true);

    // attach events
    const buttons = elm.querySelector(':scope > .buttons');
    buttons
      .querySelector(':scope > button:nth-child(1)')
      .addEventListener('click', e => {
        e.stopPropagation();
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

  definePath(path) {
    this.#path = path;
  }

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

  #queryTemplate() {
    return `${
      this.#path.url
    }?sparqlet=@@sparqlet@@&primaryKey=@@primaryKey@@&categoryIds=&userKey=${
      ConditionBuilder.currentTogoKey
    }&userIds=${encodeURIComponent(
      this.#USER_IDS.value.replace(/,/g, ' ').split(/\s+/).join(',')
    )}`;
  }

  #getProperty({propertyId, data, primaryKey}) {
    axios
      .get(
        this.#queryTemplate()
          .replace('@@sparqlet@@', encodeURIComponent(data))
          .replace('@@primaryKey@@', encodeURIComponent(primaryKey)),
        {cancelToken: this.#source.token}
      )
      .then(response => {
        this.#BODY.classList.add('-showuserids');

        // dispatch event
        const customEvent = new CustomEvent(event.setUserValues, {
          detail: {
            propertyId,
            values: response.data,
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
      })
      .catch(() => {
        const customEvent = new CustomEvent(event.toggleErrorUserValues, {
          detail: {
            mode: 'show',
            propertyId,
            message: 'Failed to map this ID',
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
        this.#errorCount++;
      })
      .then(() => {
        this.#offset += 1;
        this.#progressIndicator.updateProgressBar({
          offset: this.#offset,
        });
        if (this.#offset >= Records.properties.length) {
          this.#complete(this.#errorCount > 0);
        }
      });
  }

  #complete(withError = false) {
    this.#ROOT.dataset.status = 'complete';
    this.#offset = 0;
    if (withError) {
      this.#progressIndicator.setIndicator(
        `Failed to map IDs for ${this.#errorCount} propert${this.#errorCount === 1 ? 'y' : 'ies'}`,
        undefined,
        true
      );
    }
  }

  #clear() {
    this.#source.cancel('user cancel');
    this.#progressIndicator.reset();
    this.#complete();

    this.#BODY.classList.remove('-showuserids');
    this.#USER_IDS.value = '';
    const customEvent = new CustomEvent(event.clearUserValues);
    DefaultEventEmitter.dispatchEvent(customEvent);

    const customEvent2 = new CustomEvent(event.toggleErrorUserValues, {
      detail: {
        mode: 'hide',
      },
    });
    DefaultEventEmitter.dispatchEvent(customEvent2);
    ConditionBuilder.setUserIds();
  }
}
