import ConditionBuilder from "./ConditionBuilder";

export default class StackingConditionView {

  #delegate;
  #type;
  #values;
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
  constructor(delegate, container, type, condition, isRange = false) {
    console.log(condition)

    this.#delegate = delegate;
    this.#type = type;
    this.#condition = condition;
    this.#isRange = isRange;
    
    // attributes
    this.#ROOT = document.createElement('div');
    this.#ROOT.classList.add('stacking-condition-view');
    this.#ROOT.dataset.subjectId = condition.subject.subjectId;
    this.#ROOT.dataset.propertyId = condition.property.propertyId;
    if (condition.value) this.#ROOT.dataset.categoryId = condition.value.categoryId;
    if (condition.subCategory) this.#ROOT.dataset.parentCategoryId = condition.subCategory.parentCategoryId;
    // make view
    let label, ancestors = [condition.subject.subject];
    switch(type) {
      case 'property':
        label = `<div class="label _subject-color">${condition.subCategory ? condition.subCategory.label : condition.property.label}</div>`;
        if (condition.subCategory) ancestors.push(condition.property.label, ...condition.subCategory.ancestors);
        break;
      case 'value':
        label = `<ul class="labels"></ul>`;
        ancestors.push(condition.property.label, ...condition.value.ancestors);
        break;
    }
    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <ul class="path">
      ${ancestors.map(ancestor => `<li>${ancestor}</li>`).join('')}
    </ul>
    ${label}`;
    container.insertAdjacentElement('beforeend', this.#ROOT);
    // reference
    if (type === 'value') {
      this.#LABELS = this.#ROOT.querySelector(':scope > .labels');
      this.addValue(condition.value);
    }

    // event
    this.#ROOT.querySelector(':scope > .close-button-view').addEventListener('click', () => {
      switch (type) {
        case 'property':
          // notify
          ConditionBuilder.removeProperty(this.#condition.property.propertyId, this.#condition.subCategory?.parentCategoryId);
          break;
        case 'value':
          for (const label of this.#LABELS.querySelectorAll(':scope > .label')) {
            ConditionBuilder.removePropertyValue(this.#condition.property.propertyId, label.dataset.categoryId);
          }
          break;
      }
    });
  }


  // public methods

  addValue(value) {
    this.#LABELS.insertAdjacentHTML('beforeend', `<li class="label _subject-background-color" data-category-id="${value.categoryId}">${value.label}<div class="close-button-view"></div></li>`);
    // attach event
    this.#LABELS.querySelector(':scope > .label:last-child').addEventListener('click', e => {
      e.stopPropagation();
      ConditionBuilder.removePropertyValue(this.#condition.property.propertyId, e.target.parentNode.dataset.categoryId);
    });
  }

  removeProperty(propertyId, parentCategoryId) {
    const isMatch = propertyId === this.#condition.property.propertyId
      && parentCategoryId ? parentCategoryId === this.#condition.subCategory?.parentCategoryId : true;
    if (isMatch) this.#ROOT.parentNode.removeChild(this.#ROOT);
    return isMatch;
  }

  removePropertyValue(propertyId, categoryId) {
    if (propertyId === this.#condition.property.propertyId) {
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
    console.log(propertyId, this.#condition)
    return propertyId === this.#condition.property.propertyId;
  }


  // accessor

  get elm() {
    return this.#ROOT;
  }

}