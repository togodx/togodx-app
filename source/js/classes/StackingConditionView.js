import ConditionBuilder from "./ConditionBuilder";
import Records from "./Records";
import KeyCondition from "./KeyCondition";
import ValuesCondition from "./ValuesCondition";

const POLLING_DURATION = 1000;

export default class StackingConditionView {

  // #isRange;
  #condition;
  #ROOT;
  #LABELS;
  
  /**
   * 
   * @param {HTMLElement} container 
   * @param {String} type: 'property' or 'value'
   * @param {keyCondition, valuesCondition} condition 
   */
  constructor(container, type, condition, isRange = false) {
    console.log(container, type, condition)

    this.#condition = condition;
    const category = Records.getCatexxxgoryWithAttribute(condition.propertyId);
    const property = Records.getProperty(condition.propertyId);
    console.log(property)
    const attribute = Records.getAttribute(condition.propertyId);
    console.log(attribute)
    // this.#isRange = isRange;
    
    // attributes
    this.#ROOT = document.createElement('div');
    this.#ROOT.classList.add('stacking-condition-view');
    this.#ROOT.dataset.catexxxgoryId = category.id;
    this.#ROOT.dataset.propertyId = condition.propertyId;
    if (condition.parentCategoryId) this.#ROOT.dataset.parentCategoryId = condition.parentCategoryId;
    // make view
    let label, ancestorLabels = [category.label];
    switch(true) {
      case this.#condition instanceof KeyCondition: {
        if (condition.parentCategoryId) {
          const getValue = () => {
            const value = Records.getValue(condition.propertyId, condition.parentCategoryId);
            if (value) {
              const ancestors = Records.getAncestors(condition.propertyId, condition.parentCategoryId);
              label = `<div class="label _catexxxgory-color">${value.label}</div>`;
              ancestorLabels.push(attribute.label, ...ancestors.map(ancestor => ancestor.label));
              this.#make(container, type, ancestorLabels, label);
            } else {
              setTimeout(getValue, POLLING_DURATION);
            }
          }
          getValue();
        } else {
          label = `<div class="label _catexxxgory-color">${attribute.label}</div>`;
          this.#make(container, type, ancestorLabels, label);
        }
      }
        break;
      case this.#condition instanceof ValuesCondition:
        label = `<ul class="labels"></ul>`;
        ancestorLabels.push(attribute.label);
        this.#make(container, type, ancestorLabels, label);
        break;
    }

    // TODO: クリックイベントで当該要素を表示する
  }


  // private methods

  #make(container, type, ancestorLabels, label) {
    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <ul class="path">
      ${ancestorLabels.map(ancestor => `<li>${ancestor}</li>`).join('')}
    </ul>
    ${label}`;
    container.insertAdjacentElement('beforeend', this.#ROOT);
    // reference
    if (this.#condition instanceof ValuesCondition) {
      this.#LABELS = this.#ROOT.querySelector(':scope > .labels');
      for (const categoryId of this.#condition.categoryIds) {
        console.log(categoryId);
        this.addValue(categoryId);
      }
    }

    // event
    this.#ROOT.querySelector(':scope > .close-button-view').addEventListener('click', () => {
      switch (true) {
        case this.#condition instanceof KeyCondition:
          // notify
          ConditionBuilder.removeProperty(this.#condition.propertyId, this.#condition.parentCategoryId);
          break;
        case this.#condition instanceof ValuesCondition:
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
      console.log(value)
      if (value === undefined) {
        setTimeout(getValue, POLLING_DURATION);
      } else {
        this.#LABELS.insertAdjacentHTML('beforeend', `<li class="label _catexxxgory-background-color" data-catexxxgory-id="${value.categoryId}">${value.label}<div class="close-button-view"></div></li>`);
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

}
