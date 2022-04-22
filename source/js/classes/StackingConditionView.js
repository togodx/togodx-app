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

    this.#condition = condition;
    const attribute = Records.getAttribute(condition.attributeId);
    // this.#isRange = isRange;
    
    // attributes
    this.#ROOT = document.createElement('div');
    this.#ROOT.classList.add('stacking-condition-view');
    this.#ROOT.dataset.catexxxgoryId = condition.catexxxgoryId;
    this.#ROOT.dataset.attributeId = condition.attributeId;
    if (condition.parentCategoryId) this.#ROOT.dataset.parentCategoryId = condition.parentCategoryId;
    // make view
    let label, ancestorLabels = [Records.getCatexxxgory(condition.catexxxgoryId).label];
    switch(true) {
      case this.#condition instanceof KeyCondition: {
        if (condition.parentCategoryId) {
          const getValue = () => {
            const value = condition.value;
            if (value) {
              label = `<div class="label _catexxxgory-color">${value.label}</div>`;
              ancestorLabels.push(attribute.label, ...condition.ancestors.map(ancestor => {
                return Records.getValue(condition.attributeId, ancestor).label;
              }));
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
      for (const node of this.#condition.nodes) {
        this.addValue(node);
      }
    }

    // event
    this.#ROOT.querySelector(':scope > .close-button-view').addEventListener('click', () => {
      switch (true) {
        case this.#condition instanceof KeyCondition:
          // notify
          ConditionBuilder.removeAttribute(this.#condition.attributeId, this.#condition.parentCategoryId);
          break;
        case this.#condition instanceof ValuesCondition:
          for (const label of this.#LABELS.querySelectorAll(':scope > .label')) {
            ConditionBuilder.removeAttributeValue(this.#condition.attributeId, label.dataset.node);
          }
          break;
      }
    });
  }


  // public methods

  addValue(node) {
    const getValue = () => {
      const value = Records.getValue(this.#condition.attributeId, node);
      if (value === undefined) {
        setTimeout(getValue, POLLING_DURATION);
      } else {
        this.#LABELS.insertAdjacentHTML('beforeend', `<li class="label _catexxxgory-background-color" data-category-id="${value.node}">${value.label}<div class="close-button-view"></div></li>`);
        // attach event
        this.#LABELS.querySelector(':scope > .label:last-child').addEventListener('click', e => {
          e.stopPropagation();
          ConditionBuilder.removeAttributeValue(this.#condition.attributeId, e.target.parentNode.dataset.node);
        });
      }
    }
    getValue();
  }

  removeAttribute(keyCondition) {
    const isMatch =
      (keyCondition.attributeId === this.#condition.attributeId) &&
      (keyCondition.parentCategoryId ? keyCondition.parentCategoryId === this.#condition.parentCategoryId : true);
    if (isMatch) this.#ROOT.parentNode.removeChild(this.#ROOT);
    return isMatch;
  }

  removeAttributeValue(attributeId, node) {
    if (attributeId === this.#condition.attributeId) {
      this.#LABELS.removeChild(this.#LABELS.querySelector(`:scope > [data-category-id="${node}"`));
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

  sameAttribute(attributeId) {
    return attributeId === this.#condition.attributeId;
  }

}
