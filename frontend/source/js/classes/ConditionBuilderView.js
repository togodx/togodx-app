import App from "./App";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";
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
      switch (e.detail.action) {
        case 'add':
          this.#addProperty(e.detail.condition.subject, e.detail.condition.property);
          break;
        case 'remove':
          this.#removeProperty(e.detail.propertyId);
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

  #defineTogoKeys(togoKeys) {
    // make options
    this.#TOGO_KEYS.innerHTML = togoKeys.map(togoKey => `<option value="${togoKey.togoKey}" data-subject-id="${togoKeys.subjectId}">${togoKey.label} (${togoKey.togoKey})</option>`).join('');
    this.#TOGO_KEYS.disabled = false;
    // attach event
    this.#TOGO_KEYS.addEventListener('change', e => {
      const togoKey = togoKeys.find(togoKey => togoKey.togoKey === e.target.value);
      ConditionBuilder.setSubject(e.target.value, togoKey.subjectId);
    });
    this.#TOGO_KEYS.dispatchEvent(new Event('change'));
  }

  #addProperty(subject, property) {
    // make view
    const view = document.createElement('div');
    view.classList.add('stacking-condition-view');
    view.dataset.propertyId = property.propertyId;
    view.innerHTML = `
    <div class="closebutton"></div>
    <ul class="path">
      <li>${subject.subject}</li>
    </ul>
    <div class="label" style="color: ${App.getHslColor(subject.hue)};">${property.label}</div>`;
    this.#PROPERTIES_CONDITIONS_CONTAINER.insertAdjacentElement('beforeend', view);
    this.#PROPERTIES_CONDITIONS_CONTAINER.classList.remove('-empty');
    // event
    view.querySelector(':scope > .closebutton').addEventListener('click', () => {
      ConditionBuilder.removeProperty(view.dataset.propertyId);
    });
  }
  
  #removeProperty(propertyId) {
    const view = this.#PROPERTIES_CONDITIONS_CONTAINER.querySelector(`[data-property-id="${propertyId}"]`);
    view.parentNode.removeChild(view);
    if (this.#PROPERTIES_CONDITIONS_CONTAINER.childNodes.length === 0) this.#PROPERTIES_CONDITIONS_CONTAINER.classList.add('-empty');
  }

  #addPropertyValue(subject, property, value) {
    // make view
    const view = document.createElement('div');
    view.classList.add('stacking-condition-view');
    view.classList.add('-value');
    view.dataset.propertyId = property.propertyId;
    view.dataset.categoryId = value.categoryId;
    // view.dataset.range = [0, 0]; // TODO:
    view.style.backgroundColor = `hsl(${subject.hue}, 45%, 50%)`;
    view.innerHTML = `
    <div class="closebutton"></div>
    <ul class="path">
      <li>${subject.subject}</li>
      <li>${property.label}</li>
      ${value.ancestors.map(ancestor => `<li>${ancestor}</li>`).join('')}
    </ul>
    <div class="label">${value.label}</div>`;
    this.#ATTRIBUTES_CONDITIONS_CONTAINER.insertAdjacentElement('beforeend', view);
    this.#ATTRIBUTES_CONDITIONS_CONTAINER.classList.remove('-empty');
    // event
    view.querySelector(':scope > .closebutton').addEventListener('click', () => {
      ConditionBuilder.removePropertyValue(view.dataset.propertyId, view.dataset.categoryId);
    });
  }

  #removePropertyValue(propertyId, categoryId) {
    const view = this.#ATTRIBUTES_CONDITIONS_CONTAINER.querySelector(`[data-property-id="${propertyId}"][data-category-id="${categoryId}"]`);
    view.parentNode.removeChild(view);
    if (this.#ATTRIBUTES_CONDITIONS_CONTAINER.childNodes.length === 0) this.#ATTRIBUTES_CONDITIONS_CONTAINER.classList.add('-empty');
  }

}