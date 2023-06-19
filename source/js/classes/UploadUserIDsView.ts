import DefaultEventEmitter from './DefaultEventEmitter.ts';
import ConditionBuilder from './ConditionBuilder.ts';
import App from './App.ts';
import * as event from '../events.js';
import {getApiParameter} from '../functions/queryTemplates.js';
import ProgressIndicator from './ProgressIndicator.ts';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import PresetManager from './PresetManager.ts';

const timeOutError = 'ECONNABORTED';

export default class UploadUserIDsView {
  #ROOT: HTMLDivElement;
  #BODY: HTMLBodyElement;
  #USER_IDS: HTMLTextAreaElement;
  #progressIndicator;
  // #source;
  #offset = 0;
  #errorCount = 0;
  #currentAttributeSet: string[] = [];

  constructor(elm: HTMLDivElement) {
    // TODO: set axios settings in common file
    // TODO: set 'user cancel' as a const in axios setting file
    axios.defaults.timeout = 120_000;
    axiosRetry(axios, {
      retries: 5,
      shouldResetTimeout: true,
      retryDelay: retryCount => {
        return Math.pow(2, retryCount - 1) * 5000;
      },
      retryCondition: error => {
        return (
          error.code === timeOutError ||
          [500, 503].includes(error.response?.status)
        );
      },
    });

    this.#ROOT = elm;

    this.#BODY = document.querySelector('body') as HTMLBodyElement;
    const inner = elm.querySelector(':scope > .inner') as HTMLDivElement;
    this.#USER_IDS = inner.querySelector(':scope > textarea') as HTMLTextAreaElement;

    const progressIndicator = document.createElement('div');
    elm.append(progressIndicator);
    this.#progressIndicator = new ProgressIndicator(progressIndicator, 'simple');

    // attach events
    const tryButton = inner.querySelector(':scope > .title > .button > button') as HTMLButtonElement;
    const buttons = inner.querySelector(':scope > .buttons') as HTMLDivElement;
    const submitButton = buttons.childNodes[0] as HTMLButtonElement;
    const resetButton = buttons.childNodes[1] as HTMLButtonElement;
    tryButton.addEventListener('click', e => {
      e.stopPropagation();
      this.#USER_IDS.value = this.#USER_IDS.placeholder.replace('e.g. ', '');
      this.#USER_IDS.dispatchEvent(new Event('change'));
      submitButton.dispatchEvent(new Event('click'));
    });
    submitButton.addEventListener('click', e => {
      e.stopPropagation();
      // clear after 2nd execution
      // if (this.#source) this.#reset(true);
      this.#fetch();
      return false;
    });
    resetButton.addEventListener('click', e => {
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
    DefaultEventEmitter.addEventListener(
      event.clearCondition,
      this.#clear.bind(this)
    );
  }

  // private methods

  #fetch() {
    if (this.#USER_IDS.value === '') return;
    this.#currentAttributeSet = PresetManager.currentAttributeSet;
    this.#prepareProgressIndicator();
    this.#currentAttributeSet.forEach(attributeId => this.#getAttribute(attributeId));
  }

  #prepareProgressIndicator() {
    // reset axios cancellation
    // const CancelToken = axios.CancelToken;
    // this.#source = CancelToken.source();

    this.#ROOT.classList.add('-fetching');
    this.#ROOT.dataset.load = '';
    this.#progressIndicator.setIndicator(
      'In progress',
      this.#currentAttributeSet.length
    );
  }

  #getAttribute(attributeId: string) {
    axios
      .post(
        App.getApiUrl('locate'),
        getApiParameter('locate', {
          attribute: attributeId,
          node: '',
          dataset: ConditionBuilder.currentDataset,
          queries: ConditionBuilder.userIds,
        })
        // {
        //   cancelToken: this.#source.token,
        // }
      )
      .then(response => {
        this.#BODY.classList.add('-showuserids');
        this.#handleProp();

        // dispatch event
        const customEvent = new CustomEvent(event.setUserFilters, {
          detail: {
            attributeId: attributeId,
            filters: response.data,
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
      })
      .catch(error => {
        // if (axios.isCancel && error.message === 'user cancel') return;
        if (error.message === 'user cancel') return;
        const customEvent = new CustomEvent(event.toggleErrorUserFilters, {
          detail: {
            mode: 'show',
            attributeId: attributeId,
            message: 'Failed to map this ID',
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent);
        this.#handleProp();
        this.#errorCount++;
      })
      .then(() => {
        if (this.#offset >= this.#currentAttributeSet.length) {
          this.#complete(this.#errorCount > 0);
        }
      });
  }

  #handleProp() {
    this.#offset += 1;
    this.#progressIndicator.updateProgressBar(this.#offset);
  }

  #complete(withError = false) {
    const msg = withError
      ? `Failed to map IDs for ${this.#errorCount} attribute${
          this.#errorCount > 1 ? 's' : ''
        }`
      : 'Mapping completed';
    this.#progressIndicator.setIndicator(msg, undefined, withError);
    this.#ROOT.dataset.load = 'completed';
    this.#ROOT.classList.remove('-fetching');
  }

  #resetCounters() {
    this.#offset = 0;
    this.#errorCount = 0;
  }

  #reset(isPreparing = false) {
    // this.#source?.cancel('user cancel');
    this.#resetCounters();
    const customEvent = new CustomEvent(event.clearUserFilters);
    DefaultEventEmitter.dispatchEvent(customEvent);

    const customEvent2 = new CustomEvent(event.toggleErrorUserFilters, {
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
