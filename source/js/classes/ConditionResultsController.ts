import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import ConditionResultsPanelView from './ConditionResultsPanelView';
import * as event from '../events';
import axios, {AxiosError} from 'axios';
import DXCondition from './DXCondition';
import ConditionFilterUtility from './ConditionFilterUtility';
// import { LoadStatus } from './ConditionResultsPanelView';
import { Preset } from '../interfaces';

export default class ConditionResultsController {
  #dxCondition: DXCondition;
  #source: any;
  #isLoading: boolean;
  #panelView: ConditionResultsPanelView;
  #status: any;

  constructor(dxCondition: DXCondition, isSelectAfterGenerating: boolean = false) {
    const cancelToken = axios.CancelToken;
    this.#source = cancelToken.source();

    this.#isLoading = false;
    this.#dxCondition = dxCondition;
    this.#panelView = new ConditionResultsPanelView(this);
    this.#status = this.#panelView.controllerStatusProxy({});

    if (!isSelectAfterGenerating) return;
    ConditionBuilder.finish(true);
    this.select();
  }


  // private methods

  async #getQueryIds(): Promise<void> {
    // get IDs
    this.#panelView.loadIds();
    await this.#dxCondition.getIDs().catch(error => {
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

  async #getProperties(): Promise<void> {
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

  // *** Properties & Loading ***
  /**
   * @param { Error } err - first check userCancel, then server error, timeout err part of else
   */
  #handleError(err: AxiosError): void {
    console.error(err);
    if (axios.isCancel && err.message === 'user cancel') return;

    const code = err.response?.status;
    const message = err.response?.statusText || err.message;
    this.#panelView.displayError(message, Number(code));

    const customEvent = new CustomEvent(event.failedFetchConditionResultsIDs, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }


  // public methods

  deleteCondition(): void {
    const customEvent = new CustomEvent(event.deleteConditionResults, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
    // abort fetch
    this.#source.cancel('user cancel');
    // transition
    document.body.dataset.display = 'properties';
  }

  edit(): void {
    // property (attribute)
    ConditionBuilder.setAnnotation(
      this.#dxCondition.conditionUtilityAnnotations.map(
        conditionUtilityAnnotation => {
          return conditionUtilityAnnotation;
        }
      ),
      false
    );
    // attribute (classification/distribution)
    Records.attributes.forEach(({id}) => {
      const conditionUtilityFilter: ConditionFilterUtility | undefined =
        this.#dxCondition.conditionUtilityFilters.find(
          conditionUtilityFilter => conditionUtilityFilter.attributeId === id
        );
      const nodes: string[] = [];
      if (conditionUtilityFilter) nodes.push(...conditionUtilityFilter.nodes);
      ConditionBuilder.setFilter(id, nodes, false);
    });
  }

  /* public methods */
  select(): void {
    this.#panelView.selected = true;
    // dispatch event
    const customEvent1 = new CustomEvent(event.selectConditionResults, {
      detail: this,
    });
    DefaultEventEmitter.dispatchEvent(customEvent1);
    // send rows
    switch (this.#panelView.loadStatus) {
      case 'ids':
        this.#getQueryIds();
        break;
      case 'properties':
      case 'completed': {
        const customEvent2 = new CustomEvent(event.addNextRows, {
          detail: {
            dxCondition: this.#dxCondition,
            offset: 0,
            nextRows: this.data,
          },
        });
        DefaultEventEmitter.dispatchEvent(customEvent2);
      }
        break;
    }
  }

  deselect(): void {
    this.#panelView.selected = false;
  }

  next(): void {
    if (this.#isLoading) return;
    this.#getProperties();
  }

  pauseOrResume(isLoading): void {
    this.#isLoading = isLoading;
    if (this.#isLoading) {
      if (this.#status.total) this.#getProperties();
      else this.#getQueryIds();
    }
  }

  /* accessors */
  get #offset(): number {
    return this.#dxCondition.offset;
  }
  get #total(): number{
    return this.#dxCondition.ids!.length;
  }
  get togoKey() {
    return this.#dxCondition.togoKey;
  }
  get dxCondition(): DXCondition {
    return this.#dxCondition;
  }
  get data() {
    return [...this.#dxCondition.properties];
  }
  get element(): HTMLElement {
    return this.#panelView.element;
  }
  get preset(): Preset {
    return this.#panelView.preset;
  }
}
