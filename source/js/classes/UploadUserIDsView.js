import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import App from './App';
import * as event from '../events';
import * as queryTemplates from '../functions/queryTemplates';
import ProgressIndicator from './ProgressIndicator';
import axios from 'axios';
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
        return (
          (error.code === timeOutError) ||
          [500, 503].includes(error.response?.status)
        );
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
    elm.querySelector(':scope > .title > .button > button').addEventListener('click', () => {
      this.#USER_IDS.value = this.#USER_IDS.placeholder.replace('e.g. ', '');
      this.#USER_IDS.dispatchEvent(new Event('change'));
      submitButton.dispatchEvent(new Event('click'));
    });
    const buttons = elm.querySelector(':scope > .buttons');
    const submitButton = buttons.querySelector(':scope > button:nth-child(1)');
    submitButton
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


  // private methods

  // #restoreParameters({detail}) {
  //   this.#USER_IDS.value = detail.userIds;
  // }

  #fetch() {
    if (this.#USER_IDS.value === '') return;
    this.#prepareProgressIndicator();
    Records.attributes.forEach(attribute => {
      // TODO: この処理は Attribute に移行
      this.#getAttribute(attribute);
    });
  }

  #prepareProgressIndicator() {
    // reset axios cancellation
    const CancelToken = axios.CancelToken;
    this.#source = CancelToken.source();

    this.#ROOT.classList.add('-fetching');
    this.#ROOT.dataset.status = '';
    this.#progressIndicator.setIndicator(
      'In progress',
      Records.attributes.length
    );
  }

  #getAttribute({id}) {
    console.log(ConditionBuilder.userIds)
    axios
      .post(App.locate, {
        attribute: id,
        node: '',
        dataset: ConditionBuilder.currentTogoKey,
        queries: JSON.stringify(ConditionBuilder.userIds.split(','))
      })
      // .post(`${App.locate}?attribute=${
      //     id
      //   }&node=${
      //     ''
      //   }&dataset=${
      //     ConditionBuilder.currentTogoKey
      //   }&queries=${
      //     JSON.stringify(ConditionBuilder.userIds.split(','))
      //   }`,
      //   {
      //     cancelToken: this.#source.token
      //   })
      // .get(queryTemplates.dataFromUserIds(id), {
      //   cancelToken: this.#source.token,
      // })
      .then(response => {
        this.#BODY.classList.add('-showuserids');
        this.#handleProp();

        // dispatch event
        const customEvent = new CustomEvent(event.setUserValues, {
          detail: {
            attributeId: id,
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
            attributeId: id,
            message: 'Failed to map this ID',
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
        this.#handleProp();
        this.#errorCount++;
      })
      .then(() => {
        if (this.#offset >= Records.attributes.length) {
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
    let msg = withError
      ? `Failed to map IDs for ${this.#errorCount} attribute${
          this.#errorCount > 1 ? 's' : ''
        }`
      : 'Mapping completed';
    this.#progressIndicator.setIndicator(msg, undefined, withError);
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
