import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import StackingConditionView from "./StackingConditionView";
import ConditionAnnotation from "./ConditionAnnotation";
import ConditionFilter from "./ConditionFilter";
import * as event from '../events';

const POLLING_DURATION = 100;

export default class ConditionBuilderView {

  #properties;
  #propertyFilters;
  #isDefined;
  #placeHolderExamples;
  #TOGO_KEYS;
  #USER_IDS;
  #PROPERTIES_CONDITIONS_CONTAINER;
  #ATTRIBUTES_CONDITIONS_CONTAINER;
  #EXEC_BUTTON;

  constructor(elm) {

    this.#properties = [];
    this.#propertyFilters = [];
    this.#isDefined = false;
  
    // references
    const conditionsContainer = elm.querySelector(':scope > .conditions');
    this.#TOGO_KEYS = conditionsContainer.querySelector('#ConditionTogoKey > .inner > select');
    this.#USER_IDS = elm.querySelector('#UploadUserIDsView > textarea');
    this.#PROPERTIES_CONDITIONS_CONTAINER = document.querySelector('#ConditionFilters > .inner > .conditions');
    this.#ATTRIBUTES_CONDITIONS_CONTAINER = document.querySelector('#ConditionAnnotations > .inner > .conditions');
    this.#EXEC_BUTTON = elm.querySelector(':scope > footer > button.exec');

    // attach event
    document.querySelector('#ConditionAnnotations').addEventListener('click', () => document.body.dataset.condition = 'filter');
    document.querySelector('#ConditionFilters').addEventListener('click', () => document.body.dataset.condition = 'annotation');
    this.#EXEC_BUTTON.addEventListener('click', () => {
      document.body.dataset.display = 'results';
      ConditionBuilder.makeQueryParameter();
    });
    elm.querySelector(':scope > footer > button.return').addEventListener('click', () => {
      document.body.dataset.display = 'properties';
    });
    elm.querySelector(':scope > header > button.rounded-button-view').addEventListener('click', () => {
      const customEvent = new CustomEvent(event.clearCondition);
      DefaultEventEmitter.dispatchEvent(customEvent);
    });

    // event listeners
    DefaultEventEmitter.addEventListener(event.mutateAnnotationCondition, ({detail: {action, conditionAnnotation}}) => {
      switch (action) {
        case 'add':
          this.#addAnnotation(conditionAnnotation);
          break;
        case 'remove':
          this.#removeAnnotation(conditionAnnotation);
          break;
      }
    });
    DefaultEventEmitter.addEventListener(event.mutateFilterCondition, ({detail: {action, attributeId, node}}) => {
      switch (action) {
        case 'add':
          this.#addFilter(attributeId, node);
          break;
        case 'remove':
          this.#removeFilter(attributeId, node);
          break;
      }
    });
    DefaultEventEmitter.addEventListener(event.defineTogoKey, this.#defineTogoKeys.bind(this));
    DefaultEventEmitter.addEventListener(event.mutateEstablishConditions, e => {
      this.#EXEC_BUTTON.disabled = !e.detail;
    });

  }
  

  // private methods

  #defineTogoKeys({detail: {datasets}}) {
    this.#isDefined = true;
    this.#placeHolderExamples = Object.fromEntries(Object.keys(datasets).map(key => [key, datasets[key].examples]));
    // make options
    this.#TOGO_KEYS.innerHTML = Object.keys(datasets)
      .filter(key => datasets[key].target)
      .map(key => `<option value="${key}">${datasets[key].label}</option>`)
      .join('');
    this.#TOGO_KEYS.disabled = false;
    this.#TOGO_KEYS.value = ConditionBuilder.currentDataset;
    // attach event
    this.#TOGO_KEYS.addEventListener('change', e => {
      ConditionBuilder.setSubject(e.target.value);
      this.#USER_IDS.placeholder = `e.g. ${this.#placeHolderExamples[e.target.value].join(', ')}`;
    });
    // preset
    const dataset = ConditionBuilder.currentDataset;
    if (dataset && Array.from(this.#TOGO_KEYS.options).map(option => option.value).indexOf(dataset) !== -1) {
      this.#TOGO_KEYS.value = dataset;
    } else {
      this.#TOGO_KEYS.options[0].selected = true;
    }
    this.#TOGO_KEYS.dispatchEvent(new Event('change'));
  }

  #addAnnotation(conditionAnnotation) {
    // modifier
    this.#PROPERTIES_CONDITIONS_CONTAINER.classList.remove('-empty');
    // make view
    this.#properties.push(new StackingConditionView(this.#PROPERTIES_CONDITIONS_CONTAINER, 'annotation', conditionAnnotation));
  }
  
  #removeAnnotation(conditionAnnotation) {
    // remove from array
    const index = this.#properties.findIndex(stackingConditionView => stackingConditionView.removeAnnotation(conditionAnnotation));
    this.#properties.splice(index, 1);
    // modifier
    if (this.#properties.length === 0) this.#PROPERTIES_CONDITIONS_CONTAINER.classList.add('-empty');
  }

  #addFilter(attributeId, node) {
    // modifier
    this.#ATTRIBUTES_CONDITIONS_CONTAINER.classList.remove('-empty');
    // find a condition view has same attribute id
    const stackingConditionView = this.#propertyFilters.find(stackingConditionView => stackingConditionView.sameAttribute(attributeId));
    if (stackingConditionView) {
      // if it exists, add new node
      stackingConditionView.addFilter(node);
    } else {
      // otherwise, make new condition view
      this.#propertyFilters.push(new StackingConditionView(this.#ATTRIBUTES_CONDITIONS_CONTAINER, 'value', new ConditionFilter(attributeId, [node])));
    }
  }

  #removeFilter(attributeId, node) {
    // remove from array
    const index = this.#propertyFilters.findIndex(stackingConditionView => stackingConditionView.removeFilter(attributeId, node));
    if (index !== -1) this.#propertyFilters.splice(index, 1);
    // modifier
    if (this.#propertyFilters.length === 0) this.#ATTRIBUTES_CONDITIONS_CONTAINER.classList.add('-empty');
  }

}