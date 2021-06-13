import ConditionBuilder from "./ConditionBuilder";
import Records from "./Records";

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
    console.log(condition)

    this.#condition = condition;
    const subject = Records.getSubjectWithPropertyId(condition.propertyId);
    const property = Records.getProperty(condition.propertyId);
    console.log(subject, property)
    // this.#isRange = isRange;
    
    // attributes
    this.#ROOT = document.createElement('div');
    this.#ROOT.classList.add('stacking-condition-view');
    this.#ROOT.dataset.subjectId = subject.subjectId;
    this.#ROOT.dataset.propertyId = condition.propertyId;
    if (condition.value) this.#ROOT.dataset.categoryId = condition.value.categoryId;
    if (condition.subCategory) this.#ROOT.dataset.parentCategoryId = condition.subCategory.parentCategoryId;
    // make view
    let label, ancestors = [subject.subject];
    switch(type) {
      case 'property':
        label = `<div class="label _subject-color">${condition.subCategory ? condition.subCategory.label : property.label}</div>`;
        if (condition.subCategory) ancestors.push(property.label, ...condition.subCategory.ancestors);
        break;
      case 'value':
        label = `<ul class="labels"></ul>`;
        ancestors.push(property.label, ...condition.value.ancestors);
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
          ConditionBuilder.removeProperty(this.#condition.propertyId, this.#condition.subCategory?.parentCategoryId);
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

  addValue(value) {
    this.#LABELS.insertAdjacentHTML('beforeend', `<li class="label _subject-background-color" data-category-id="${value.categoryId}">${value.label}<div class="close-button-view"></div></li>`);
    // attach event
    this.#LABELS.querySelector(':scope > .label:last-child').addEventListener('click', e => {
      e.stopPropagation();
      ConditionBuilder.removePropertyValue(this.#condition.propertyId, e.target.parentNode.dataset.categoryId);
    });
  }

  removeProperty(propertyId, parentCategoryId) {
    const isMatch =
      (propertyId === this.#condition.propertyId) &&
      (parentCategoryId ? parentCategoryId === this.#condition.subCategory?.parentCategoryId : true);
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


  // accessor

  get elm() {
    return this.#ROOT;
  }

}