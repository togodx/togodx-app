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
        label = `<ul class="labels">${this.#valueLabel(condition.value.categoryId, condition.value.label)}</ul>`;
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
      console.log(this.#LABELS);
    }

    // event
    this.#ROOT.querySelector(':scope > .close-button-view').addEventListener('click', () => {
      console.log('click')
      switch (type) {
        case 'property':
          // notify
          ConditionBuilder.removeProperty(this.#condition.property.propertyId, this.#condition.subCategory?.parentCategoryId);
          break;
        case 'value':
          break;
      }
    });
  }


  // private methods

  #valueLabel(categoryId, label) {
    return `<li class="label _subject-background-color" data-category-id="${categoryId}">${label}<div class="close-button-view"></div></li>`;
  }


  // public methods

  addValue(value) {
    console.log(this, value)
    this.#LABELS.insertAdjacentHTML('beforeend', this.#valueLabel(value.categoryId, value.label));
  }

  removeValue(value) {

  }

  removeProperty(propertyId, parentCategoryId) {
    const isMatch = propertyId === this.#condition.property.propertyId
      && parentCategoryId ? parentCategoryId === this.#condition.subCategory?.parentCategoryId : true;
    if (isMatch) this.#ROOT.parentNode.removeChild(this.#ROOT);
    return isMatch;
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