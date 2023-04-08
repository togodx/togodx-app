import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import ConditionResultsPanelView from './ConditionResultsPanelView';
import * as event from '../events';
import axios from 'axios';

export default class ConditionResultsController {
  #dxCondition;
  #source;
  #isLoading;
  #panelView;
  #status;
  #ROOT;

  constructor(dxCondition) {
    const cancelToken = axios.CancelToken;
    this.#source = cancelToken.source();

    this.#isLoading = false;
    this.#dxCondition = dxCondition;
    this.#panelView = new ConditionResultsPanelView(this);
    this.#status = this.#panelView.controllerStatusProxy({});

    const elm = this.#panelView.element;

    // reference
    this.#ROOT = elm;

    ConditionBuilder.finish();
    this.select();
    this.#getQueryIds();
  }

  /* private methods */
  deleteCondition() {
    const customEvent = new CustomEvent(event.deleteConditionResults, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
    // abort fetch
    this.#source.cancel('user cancel');
    // transition
    document.body.dataset.display = 'properties';
  }

  edit() {
    // property (attribute)
    ConditionBuilder.setAnnotation(
      this.#dxCondition.conditionAnnotations.map(conditionAnnotation => {
        return conditionAnnotation;
      }),
      false
    );
    // attribute (classification/distribution)
    Records.attributes.forEach(({id}) => {
      const conditionFilter = this.#dxCondition.conditionFilters.find(
        conditionFilter => conditionFilter.attributeId === id
      );
      const nodes = [];
      if (conditionFilter) nodes.push(...conditionFilter.nodes);
      ConditionBuilder.setFilter(id, nodes, false);
    });
  }

  // *** Properties & Loading ***
  /**
   * @param { Error } err - first check userCancel, then server error, timeout err part of else
   */
  #handleError(err) {
    console.log(err);
    if (axios.isCancel && err.message === 'user cancel') return;

    const code = err.response?.status;
    const message = err.response?.statusText || err.message;
    this.#panelView.displayError(message, code);

    const customEvent = new CustomEvent(event.failedFetchConditionResultsIDs, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  async #getQueryIds() {
    // get IDs
    await this.#dxCondition.ids.catch(error => {
      this.#handleError(error);
    });
    this.#status.total = this.#total;
    if (this.#total <= 0) {
      const customEvent = new CustomEvent(event.addNextRows, {
        detail: {
          dxCondition: this.#dxCondition,
          offset: 0,
          nextRows: [],
        },
      });
      DefaultEventEmitter.dispatchEvent(customEvent);
      return;
    }
    this.#getProperties();
  }

  async #getProperties() {
    this.#isLoading = true;

    const offset = this.#offset;
    this.#status.current = offset;
    const nextRows = await this.#dxCondition
      .getNextProperties()
      .catch(error => this.#handleError(error));
    if (!nextRows) return;

    // dispatch event
    const customEvent = new CustomEvent(event.addNextRows, {
      detail: {
        dxCondition: this.#dxCondition,
        offset,
        nextRows,
      },
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
    // turn off after finished
    if (this.#dxCondition.isPropertiesLoaded) {
      this.#status.current = this.#offset;
    } else if (this.#isLoading) this.#getProperties();
  }

  /* public methods */
  select() {
    this.#panelView.selected = true;
    // dispatch event
    const customEvent1 = new CustomEvent(event.selectConditionResults, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent1);
    // send rows
    if (this.#panelView.loadStatus !== 'ids') {
      const customEvent2 = new CustomEvent(event.addNextRows, {
        detail: {
          dxCondition: this.#dxCondition,
          offset: 0,
          nextRows: this.data,
        },
      });
      DefaultEventEmitter.dispatchEvent(customEvent2);
    }
  }

  deselect() {
    this.#panelView.selected = false;
  }

  next() {
    if (this.#isLoading) return;
    this.#getProperties();
  }

  pauseOrResume(isLoading) {
    this.#isLoading = isLoading;
    if (this.#isLoading) {
      if (this.#status.total) this.#getProperties();
      else this.#getQueryIds();
    }
  }

  /* public accessors */
  get #offset() {
    return this.#dxCondition.offset;
  }
  get #total() {
    return this.#dxCondition.ids?.length;
  }
  get togoKey() {
    return this.#dxCondition.togoKey;
  }
  get dxCondition() {
    return this.#dxCondition;
  }
  get data() {
    return [...this.#dxCondition.properties];
  }
  get element() {
    return this.#panelView.element;
  }
}
