import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
import StackingConditionView from "./StackingConditionView";
import * as event from '../events';

export default class ConditionBuilderView {

  #TOGO_KEYS;
  #PROPERTIES_CONDITIONS_CONTAINER;
  #ATTRIBUTES_CONDITIONS_CONTAINER;
  #EXEC_BUTTON;

  constructor(elm) {

    // references
    const body = document.querySelector('body');
    const conditionsContainer = elm.querySelector(':scope > .conditions');
    this.#TOGO_KEYS = conditionsContainer.querySelector(':scope > .togoKey > select');
    this.#PROPERTIES_CONDITIONS_CONTAINER = conditionsContainer.querySelector(':scope > .properties > .conditions');
    this.#ATTRIBUTES_CONDITIONS_CONTAINER = conditionsContainer.querySelector(':scope > .attributes > .conditions');
    this.#EXEC_BUTTON = elm.querySelector(':scope > footer > button.exec');

    // attach event
    this.#EXEC_BUTTON.addEventListener('click', () => {
      body.dataset.display = 'results';
      ConditionBuilder.makeQueryParameter();
    });

    // event listeners
    DefaultEventEmitter.addEventListener(event.mutatePropertyCondition, e => {
      console.log(e.detail)
      switch (e.detail.action) {
        case 'add':
          this.#addProperty(e.detail.condition.subject, e.detail.condition.property, e.detail.condition.subCategory);
          break;
        case 'remove':
          this.#removeProperty(e.detail.propertyId, e.detail.parentCategoryId);
          break;
      }
    });
    DefaultEventEmitter.addEventListener(event.mutatePropertyValueCondition, e => {
      switch (e.detail.action) {
        case 'add':
          this.#addPropertyValue(e.detail.condition.subject, e.detail.condition.property, e.detail.condition.value);
          break;
        case 'remove':
          this.#removePropertyValue(e.detail.propertyId, e.detail.categoryId);
          break;
      }
    });
    DefaultEventEmitter.addEventListener(event.defineTogoKey, e => {
      this.#defineTogoKeys(e.detail);
    });
    DefaultEventEmitter.addEventListener(event.mutateEstablishConditions, e => {
      this.#EXEC_BUTTON.disabled = !e.detail;
    });

  }

  // private methods

  #defineTogoKeys(subjects) {
    // make options
    this.#TOGO_KEYS.innerHTML = subjects.map(subject => {
      let option = '';
      if (subject.togoKey) option = `<option value="${subject.togoKey}" data-subject-id="${subjects.subjectId}">${subject.keyLabel}</option>`;
      return option;
    }).join('');
    this.#TOGO_KEYS.disabled = false;
    // attach event
    this.#TOGO_KEYS.addEventListener('change', e => {
      const subject = subjects.find(subject => subject.togoKey === e.target.value);
      ConditionBuilder.setSubject(e.target.value, subject.subjectId);
    });
    this.#TOGO_KEYS.dispatchEvent(new Event('change'));
  }

  #addProperty(subject, property, subCategory) {
    console.log(property, subCategory)
    this.#PROPERTIES_CONDITIONS_CONTAINER.classList.remove('-empty');
    // make view
    const view = new StackingConditionView(this.#PROPERTIES_CONDITIONS_CONTAINER, 'property', {subject, property, subCategory});
    // event
    view.elm.querySelector(':scope > .close-button-view').addEventListener('click', () => {
      ConditionBuilder.removeProperty(view.elm.dataset.propertyId, view.elm.dataset.parentCategoryId);
    });
  }
  
  #removeProperty(propertyId, parentCategoryId) {
    let selector = `[data-property-id="${propertyId}"]`;
    if (parentCategoryId) selector += `[data-parent-category-id="${parentCategoryId}"]`;
    const view = this.#PROPERTIES_CONDITIONS_CONTAINER.querySelector(selector);
    view.parentNode.removeChild(view);
    if (this.#PROPERTIES_CONDITIONS_CONTAINER.childNodes.length === 0) this.#PROPERTIES_CONDITIONS_CONTAINER.classList.add('-empty');
  }

  #addPropertyValue(subject, property, value) {
    this.#ATTRIBUTES_CONDITIONS_CONTAINER.classList.remove('-empty');
    // make view
    const view = new StackingConditionView(this.#ATTRIBUTES_CONDITIONS_CONTAINER, 'value', {subject, property, value});
    // event
    view.elm.querySelector(':scope > .close-button-view').addEventListener('click', () => {
      ConditionBuilder.removePropertyValue(view.elm.dataset.propertyId, view.elm.dataset.categoryId);
    });
  }

  #removePropertyValue(propertyId, categoryId) {
    const view = this.#ATTRIBUTES_CONDITIONS_CONTAINER.querySelector(`[data-property-id="${propertyId}"][data-category-id="${categoryId}"]`);
    view.parentNode.removeChild(view);
    if (this.#ATTRIBUTES_CONDITIONS_CONTAINER.childNodes.length === 0) this.#ATTRIBUTES_CONDITIONS_CONTAINER.classList.add('-empty');
  }

}