import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import StackingConditionView from "./StackingConditionView";
import KeyCondition from "./KeyCondition";
import ValuesCondition from "./ValuesCondition";
import * as event from '../events';

const POLLING_DURATION = 100;

export default class ConditionBuilderView {

  #properties;
  #propertyValues;
  #isDefined;
  #placeHolderExamples;
  #TOGO_KEYS;
  #USER_IDS;
  #PROPERTIES_CONDITIONS_CONTAINER;
  #ATTRIBUTES_CONDITIONS_CONTAINER;
  #EXEC_BUTTON;

  constructor(elm) {

    this.#properties = [];
    this.#propertyValues = [];
    this.#isDefined = false;
  
    // references
    const conditionsContainer = elm.querySelector(':scope > .conditions');
    this.#TOGO_KEYS = conditionsContainer.querySelector('#ConditionTogoKey > .inner > select');
    this.#USER_IDS = elm.querySelector('#UploadUserIDsView > textarea');
    this.#PROPERTIES_CONDITIONS_CONTAINER = document.querySelector('#ConditionValues > .inner > .conditions');
    this.#ATTRIBUTES_CONDITIONS_CONTAINER = document.querySelector('#ConditionKeys > .inner > .conditions');
    this.#EXEC_BUTTON = elm.querySelector(':scope > footer > button.exec');

    // attach event
    document.querySelector('#ConditionKeys').addEventListener('click', () => document.body.dataset.condition = 'value');
    document.querySelector('#ConditionValues').addEventListener('click', () => document.body.dataset.condition = 'key');
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
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, e => {
      switch (e.detail.action) {
        case 'add':
          this.#addProperty(e.detail.propertyId, e.detail.parentCategoryId);
          break;
        case 'remove':
          this.#removeProperty(e.detail.propertyId, e.detail.parentCategoryId);
          break;
      }
    });
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, e => {
      switch (e.detail.action) {
        case 'add':
          this.#addPropertyValue(e.detail.propertyId, e.detail.categoryId);
          break;
        case 'remove':
          this.#removePropertyValue(e.detail.propertyId, e.detail.categoryId);
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
    this.#TOGO_KEYS.value = ConditionBuilder.currentTogoKey;
    // attach event
    this.#TOGO_KEYS.addEventListener('change', e => {
      ConditionBuilder.setSubject(e.target.value);
      this.#USER_IDS.placeholder = `e.g. ${this.#placeHolderExamples[e.target.value].join(', ')}`;
    });
    // preset
    const togoKey = ConditionBuilder.currentTogoKey;
    if (togoKey && Array.from(this.#TOGO_KEYS.options).map(option => option.value).indexOf(togoKey) !== -1) {
      this.#TOGO_KEYS.value = togoKey;
    } else {
      this.#TOGO_KEYS.options[0].selected = true;
    }
    this.#TOGO_KEYS.dispatchEvent(new Event('change'));
  }

  #addProperty(propertyId, parentCategoryId) {
    // modifier
    this.#PROPERTIES_CONDITIONS_CONTAINER.classList.remove('-empty');
    // make view
    this.#properties.push(new StackingConditionView(this.#PROPERTIES_CONDITIONS_CONTAINER, 'key', new KeyCondition(propertyId, parentCategoryId)));
  }
  
  #removeProperty(propertyId, parentCategoryId) {
    // remove from array
    const index = this.#properties.findIndex(stackingConditionView => stackingConditionView.removeProperty(propertyId, parentCategoryId));
    this.#properties.splice(index, 1);
    // modifier
    if (this.#properties.length === 0) this.#PROPERTIES_CONDITIONS_CONTAINER.classList.add('-empty');
  }

  #addPropertyValue(propertyId, categoryId) {
    // modifier
    this.#ATTRIBUTES_CONDITIONS_CONTAINER.classList.remove('-empty');
    // find a condition view has same property id
    const stackingConditionView = this.#propertyValues.find(stackingConditionView => stackingConditionView.sameProperty(propertyId));
    if (stackingConditionView) {
      // if it exists, add new categoryId
      stackingConditionView.addValue(categoryId);
    } else {
      // otherwise, make new condition view
      this.#propertyValues.push(new StackingConditionView(this.#ATTRIBUTES_CONDITIONS_CONTAINER, 'value', new ValuesCondition(propertyId, [categoryId])));
    }
  }

  #removePropertyValue(propertyId, categoryId) {
    // remove from array
    const index = this.#propertyValues.findIndex(stackingConditionView => stackingConditionView.removePropertyValue(propertyId, categoryId));
    if (index !== -1) this.#propertyValues.splice(index, 1);
    // modifier
    if (this.#propertyValues.length === 0) this.#ATTRIBUTES_CONDITIONS_CONTAINER.classList.add('-empty');
  }

}