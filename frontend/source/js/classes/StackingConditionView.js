import ConditionBuilder from "./ConditionBuilder";
import Records from "./Records";

const POLLING_DURATION = 100;

export default class StackingConditionView {

  #isRange;
  #condition;
  #ROOT;
  #LABELS;
  
  /**
   * 
   * @param {HTMLElement} container 
   * @param {String} type: 'property' or 'value'
   * @param {Object} condition 
   */
  constructor(container, type, condition, isRange = false) {

    this.#condition = condition;
    const subject = Records.getSubjectWithPropertyId(condition.propertyId);
    const property = Records.getProperty(condition.propertyId);
    // this.#isRange = isRange;
    
    // attributes
    this.#ROOT = document.createElement('div');
    this.#ROOT.classList.add('stacking-condition-view');
    this.#ROOT.dataset.subjectId = subject.subjectId;
    this.#ROOT.dataset.propertyId = condition.propertyId;
    if (condition.value) this.#ROOT.dataset.categoryId = condition.value.categoryId;
    if (condition.parentCategoryId) this.#ROOT.dataset.parentCategoryId = condition.parentCategoryId;
    // make view
    let label, ancestorLabels = [subject.subject];
    switch(type) {
      case 'property': {
        const parentValue = condition.parentCategoryId ? Records.getValue(condition.propertyId, condition.parentCategoryId) : undefined;
        label = `<div class="label _subject-color">${parentValue ? parentValue.label : property.label}</div>`;
        if (condition.parentCategoryId) {
          console.log( Records.getValue(condition.propertyId, condition.parentCategoryId) )
          console.log( Records.getAncestors(condition.propertyId, condition.parentCategoryId) )
          ancestorLabels.push(property.label, ...Records.getAncestors(condition.propertyId, condition.parentCategoryId).map(ancestor => ancestor.label));
        }
      }
        break;
      case 'value':
        label = `<ul class="labels"></ul>`;
        ancestorLabels.push(property.label);
        break;
    }
    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <ul class="path">
      ${ancestorLabels.map(ancestor => `<li>${ancestor}</li>`).join('')}
    </ul>
    ${label}`;
    container.insertAdjacentElement('beforeend', this.#ROOT);
    // reference
    if (type === 'value') {
      this.#LABELS = this.#ROOT.querySelector(':scope > .labels');
      this.addValue(condition.categoryId);
    }

    // event
    this.#ROOT.querySelector(':scope > .close-button-view').addEventListener('click', () => {
      switch (type) {
        case 'property':
          // notify
          ConditionBuilder.removeProperty(this.#condition.propertyId, this.#condition.parentCategoryId);
          break;
        case 'value':
          for (const label of this.#LABELS.querySelectorAll(':scope > .label')) {
            ConditionBuilder.removePropertyValue(this.#condition.propertyId, label.dataset.categoryId);
          }
          break;
      }
    });
  }


  // public methods

  addValue(categoryId) {
    const getValue = () => {
      const value = Records.getValue(this.#condition.propertyId, categoryId);
      if (value === undefined) {
        setTimeout(getValue, POLLING_DURATION);
      } else {
        this.#LABELS.insertAdjacentHTML('beforeend', `<li class="label _subject-background-color" data-category-id="${value.categoryId}">${value.label}<div class="close-button-view"></div></li>`);
        // attach event
        this.#LABELS.querySelector(':scope > .label:last-child').addEventListener('click', e => {
          e.stopPropagation();
          ConditionBuilder.removePropertyValue(this.#condition.propertyId, e.target.parentNode.dataset.categoryId);
        });
      }
    }
    getValue();
  }

  removeProperty(propertyId, parentCategoryId) {
    const isMatch =
      (propertyId === this.#condition.propertyId) &&
      (parentCategoryId ? parentCategoryId === this.#condition.parentCategoryId : true);
    if (isMatch) this.#ROOT.parentNode.removeChild(this.#ROOT);
    return isMatch;
  }

  removePropertyValue(propertyId, categoryId) {
    if (propertyId === this.#condition.propertyId) {
      this.#LABELS.removeChild(this.#LABELS.querySelector(`:scope > [data-category-id="${categoryId}"`));
      if (this.#LABELS.childNodes.length === 0) {
        this.#ROOT.parentNode.removeChild(this.#ROOT);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  sameProperty(propertyId) {
    return propertyId === this.#condition.propertyId;
  }


  // private methods


}