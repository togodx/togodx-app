import ConditionBuilder from './ConditionBuilder.ts';
import DefaultEventEmitter from './DefaultEventEmitter.ts';
import StackingConditionView from './StackingConditionView.ts';
import ConditionFilterUtility from './ConditionFilterUtility.ts';
import * as event from '../events.js';
import ConditionAnnotationUtility from './ConditionAnnotationUtility.ts';

// const POLLING_DURATION = 100;

export default class ConditionBuilderView {
  #properties: StackingConditionView[];
  #propertyFilters: StackingConditionView[];
  #isDefined: boolean;
  #placeHolderExamples: { [key: string]: string[] } = {};
  #SWITCH_BUTTONS: NodeListOf<HTMLButtonElement>;
  #DATASET_KEY: HTMLSelectElement;
  #USER_IDS: HTMLTextAreaElement;
  #ANNOTATIONS_CONDITIONS_CONTAINER: HTMLDivElement;
  #FILTERS_CONDITIONS_CONTAINER: HTMLDivElement;
  #EXEC_BUTTON: HTMLButtonElement;

  constructor(elm: HTMLElement) {
    this.#properties = [];
    this.#propertyFilters = [];
    this.#isDefined = false;

    // references
    this.#SWITCH_BUTTONS = elm.querySelectorAll(
      ':scope > .switch-button-view > button'
    );
    const conditionsContainer = elm.querySelector(':scope > .conditions');
    this.#DATASET_KEY = conditionsContainer?.querySelector(
      ':scope > [data-condition-type="dataset"] > .inner > select'
    ) as HTMLSelectElement;
    this.#USER_IDS = conditionsContainer?.querySelector(
      ':scope > [data-condition-type="ids"] > .inner > textarea'
    ) as HTMLTextAreaElement;
    this.#ANNOTATIONS_CONDITIONS_CONTAINER = conditionsContainer?.querySelector(
      ':scope > .condition[data-condition-type="annotations"] > .inner > .conditions'
    ) as HTMLDivElement;
    this.#FILTERS_CONDITIONS_CONTAINER = conditionsContainer?.querySelector(
      ':scope > .condition[data-condition-type="filters"] > .inner > .conditions'
    ) as HTMLDivElement;
    this.#EXEC_BUTTON = elm.querySelector(':scope > footer > button.exec') ?? document.createElement('button');

    // attach event
    this.#SWITCH_BUTTONS.forEach(button => {
      button.addEventListener('click', () => {
        this.#SWITCH_BUTTONS.forEach(button =>
          button.classList.remove('-active')
        );
        button.classList.add('-active');
        document.body.dataset.condition = button.value;
      });
    });
    this.#EXEC_BUTTON.addEventListener('click', () => {
      document.body.dataset.display = 'results';
      ConditionBuilder.makeQueryParameter();
    });
    elm
      .querySelector(':scope > footer > button.return')
      ?.addEventListener('click', () => {
        document.body.dataset.display = 'properties';
      });
    elm
      .querySelector(':scope > header > button')
      ?.addEventListener('click', () => {
        const customEvent1 = new CustomEvent(event.clearCondition);
        DefaultEventEmitter.dispatchEvent(customEvent1);
        const customEvent2 = new CustomEvent(event.mutateEstablishConditions, {
          detail: false
        });
        DefaultEventEmitter.dispatchEvent(customEvent2);
      });

    // event listeners
    DefaultEventEmitter.addEventListener(
      event.mutateAnnotationCondition,
      (e: Event) => {
        const {detail: {action, conditionUtilityAnnotation}} = e as CustomEvent<{action: string, conditionUtilityAnnotation: ConditionAnnotationUtility}>;
        switch (action) {
          case 'add':
            this.#addAnnotation(conditionUtilityAnnotation);
            break;
          case 'remove':
            this.#removeAnnotation(conditionUtilityAnnotation);
            break;
        }
      }
    );
    DefaultEventEmitter.addEventListener(
      event.mutateFilterCondition,
      (e: Event) => {
        const {detail: {action, attributeId, node}} = e as CustomEvent<{action: string, attributeId: string, node: string}>;
        switch (action) {
          case 'add':
            this.#addFilter(attributeId, node);
            break;
          case 'remove':
            this.#removeFilter(attributeId, node);
            break;
        }
      }
    );
    DefaultEventEmitter.addEventListener(
      event.defineTogoKey,
      this.#defineDatasetKeys.bind(this) as EventListener
    );
    DefaultEventEmitter.addEventListener(event.mutateEstablishConditions, e => {
      this.#EXEC_BUTTON.disabled = !(e as CustomEvent).detail;
    });
  }

  // private methods

  #defineDatasetKeys(e: CustomEvent) {
    const {detail: {datasets}} = e;
    this.#isDefined = true;
    this.#placeHolderExamples = Object.fromEntries(
      Object.keys(datasets).map(key => [key, datasets[key].examples])
    );
    // make options
    this.#DATASET_KEY.innerHTML = Object.keys(datasets)
      .filter(key => datasets[key].target)
      .map(key => `<option value="${key}">${datasets[key].label}</option>`)
      .join('');
    this.#DATASET_KEY.disabled = false;
    this.#DATASET_KEY.value = ConditionBuilder.currentDataset;
    // attach event
    this.#DATASET_KEY.addEventListener('change', (e) => {
      ConditionBuilder.setSubject((e.target as HTMLSelectElement).value);
      this.#USER_IDS.placeholder = `e.g. ${this.#placeHolderExamples[
        (e.target as HTMLTextAreaElement).value
      ].join(', ')}`;
    });
    // preset
    const dataset = ConditionBuilder.currentDataset;
    if (
      dataset &&
      Array.from(this.#DATASET_KEY.options)
        .map(option => option.value)
        .indexOf(dataset) !== -1
    ) {
      this.#DATASET_KEY.value = dataset;
    } else {
      this.#DATASET_KEY.options[0].selected = true;
    }
    this.#DATASET_KEY.dispatchEvent(new Event('change'));
  }

  #addAnnotation(conditionUtilityAnnotation: ConditionAnnotationUtility | ConditionFilterUtility) {
    // modifier
    this.#ANNOTATIONS_CONDITIONS_CONTAINER.classList.remove('-empty');
    // make view
    this.#properties.push(
      new StackingConditionView(
        this.#ANNOTATIONS_CONDITIONS_CONTAINER,
        conditionUtilityAnnotation
      )
    );
  }

  #removeAnnotation(conditionUtilityAnnotation: ConditionAnnotationUtility) {
    // remove from array
    const index = this.#properties.findIndex(stackingConditionView =>
      stackingConditionView.removeAnnotation(conditionUtilityAnnotation)
    );
    this.#properties.splice(index, 1);
    // modifier
    if (this.#properties.length === 0)
      this.#ANNOTATIONS_CONDITIONS_CONTAINER.classList.add('-empty');
  }

  #addFilter(attributeId: string, node: string) {
    // modifier
    this.#FILTERS_CONDITIONS_CONTAINER.classList.remove('-empty');
    // find a condition view has same attribute id
    const stackingConditionView = this.#propertyFilters.find(
      stackingConditionView => stackingConditionView.sameAttribute(attributeId)
    );
    if (stackingConditionView) {
      // if it exists, add new node
      stackingConditionView.addFilter(node);
    } else {
      // otherwise, make new condition view
      this.#propertyFilters.push(
        new StackingConditionView(
          this.#FILTERS_CONDITIONS_CONTAINER,
          new ConditionFilterUtility(attributeId, [node])
        )
      );
    }
  }

  #removeFilter(attributeId: string, node: string) {
    // remove from array
    const index = this.#propertyFilters.findIndex(stackingConditionView =>
      stackingConditionView.removeFilter(attributeId, node)
    );
    if (index !== -1) this.#propertyFilters.splice(index, 1);
    // modifier
    if (this.#propertyFilters.length === 0)
      this.#FILTERS_CONDITIONS_CONTAINER.classList.add('-empty');
  }
}
