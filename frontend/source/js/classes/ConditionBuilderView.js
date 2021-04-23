import App from "./App";
import ConditionBuilder from "./ConditionBuilder";
import DefaultEventEmitter from "./DefaultEventEmitter";

export default class ConditionBuilderView {

  #select;
  #propertiesConditionsContainer;
  #attributesConditionsContainer;
  #execButton;

  constructor(elm) {

    // references
    const body = document.querySelector('body');
    this.#select = elm.querySelector(':scope > select');
    const conditionsContainer = elm.querySelector(':scope > .conditions');
    this.#propertiesConditionsContainer = conditionsContainer.querySelector(':scope > .properties > .conditions');
    this.#attributesConditionsContainer = conditionsContainer.querySelector(':scope > .attributes > .conditions');
    this.#execButton = elm.querySelector(':scope > footer > button.exec');

    // attach event
    this.#execButton.addEventListener('click', () => {
      // this.#propertiesConditionsContainer.innerHTML = '';
      // this.#attributesConditionsContainer.innerHTML = '';
      body.dataset.display = 'results';
      ConditionBuilder.makeQueryParameter();
    });

    // event listeners
    DefaultEventEmitter.addEventListener('mutatePropertyCondition', e => {
      switch (e.detail.action) {
        case 'add':
          this.#addProperty(e.detail.condition.subject, e.detail.condition.property);
          break;
        case 'remove':
          this.#removeProperty(e.detail.propertyId);
          break;
      }
    });
    DefaultEventEmitter.addEventListener('mutatePropertyValueCondition', e => {
      switch (e.detail.action) {
        case 'add':
          this.#addPropertyValue(e.detail.condition.subject, e.detail.condition.property, e.detail.condition.value);
          break;
        case 'remove':
          this.#removePropertyValue(e.detail.propertyId, e.detail.categoryId);
          break;
      }
    });
    DefaultEventEmitter.addEventListener('mutateEstablishConditions', e => {
      this.#execButton.disabled = !e.detail;
    });

  }

  // public methods

  defineTogoKeys(togoKeys) {
    // make options
    this.#select.insertAdjacentHTML('beforeend', togoKeys.map(togoKey => `<option value="${togoKey.togoKey}" data-subject-id="${togoKeys.subjectId}">${togoKey.label} (${togoKey.togoKey})</option>`).join(''));
    this.#select.disabled = false;
    // attach event
    this.#select.addEventListener('change', e => {
      const togoKey = togoKeys.find(togoKey => togoKey.togoKey === e.target.value);
      ConditionBuilder.setSubject(e.target.value, togoKey.subjectId);
    });
  }

  // private methods

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
    this.#propertiesConditionsContainer.insertAdjacentElement('beforeend', view);
    // event
    view.querySelector(':scope > .closebutton').addEventListener('click', () => {
      ConditionBuilder.removeProperty(view.dataset.propertyId);
    });
  }
  
  #removeProperty(propertyId) {
    const view = this.#propertiesConditionsContainer.querySelector(`[data-property-id="${propertyId}"]`);
    view.parentNode.removeChild(view);
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
    this.#attributesConditionsContainer.insertAdjacentElement('beforeend', view);
    // event
    view.querySelector(':scope > .closebutton').addEventListener('click', () => {
      ConditionBuilder.removePropertyValue(view.dataset.propertyId, view.dataset.categoryId);
    });
  }

  #removePropertyValue(propertyId, categoryId) {
    const view = this.#attributesConditionsContainer.querySelector(`[data-property-id="${propertyId}"][data-category-id="${categoryId}"]`);
    view.parentNode.removeChild(view);
  }

}