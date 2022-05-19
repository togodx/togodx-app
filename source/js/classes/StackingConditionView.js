import ConditionBuilder from "./ConditionBuilder";
import Records from "./Records";
import ConditionAnnotation from "./ConditionAnnotation";
import ConditionFilter from "./ConditionFilter";

const POLLING_DURATION = 1000;

export default class StackingConditionView {

  // #isRange;
  #condition;
  #ROOT;
  #LABELS;
  
  /**
   * 
   * @param {HTMLElement} container 
   * @param {String} type: 'property' or 'filter'
   * @param {conditionAnnotation, conditionFilter} condition 
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
    if (condition.parentNode) this.#ROOT.dataset.parentNode = condition.parentNode;
    // make view
    let label, ancestorLabels = [Records.getCatexxxgory(condition.catexxxgoryId).label];
    switch(true) {
      case this.#condition instanceof ConditionAnnotation: {
        if (condition.parentNode) {
          const getFilter = () => {
            const filter = condition.filter;
            if (filter) {
              label = `<div class="label _catexxxgory-color">${filter.label}</div>`;
              ancestorLabels.push(attribute.label, ...condition.ancestors.map(ancestor => {
                return Records.getFilter(condition.attributeId, ancestor).label;
              }));
              this.#make(container, type, ancestorLabels, label);
            } else {
              setTimeout(getFilter, POLLING_DURATION);
            }
          }
          getFilter();
        } else {
          label = `<div class="label _catexxxgory-color">${attribute.label}</div>`;
          this.#make(container, type, ancestorLabels, label);
        }
      }
        break;
      case this.#condition instanceof ConditionFilter:
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
    if (this.#condition instanceof ConditionFilter) {
      this.#LABELS = this.#ROOT.querySelector(':scope > .labels');
      for (const node of this.#condition.nodes) {
        this.addFilter(node);
      }
    }

    // event
    this.#ROOT.querySelector(':scope > .close-button-view').addEventListener('click', () => {
      switch (true) {
        case this.#condition instanceof ConditionAnnotation:
          // notify
          ConditionBuilder.removeAttribute(this.#condition.attributeId, this.#condition.parentNode);
          break;
        case this.#condition instanceof ConditionFilter:
          for (const label of this.#LABELS.querySelectorAll(':scope > .label')) {
            ConditionBuilder.removeAttributeFilter(this.#condition.attributeId, label.dataset.node);
          }
          break;
      }
    });
  }


  // public methods

  addFilter(node) {
    const getFilter = () => {
      const filter = Records.getFilter(this.#condition.attributeId, node);
      if (filter === undefined) {
        setTimeout(getFilter, POLLING_DURATION);
      } else {
        this.#LABELS.insertAdjacentHTML('beforeend', `<li class="label _catexxxgory-background-color" data-node="${filter.node}">${filter.label}<div class="close-button-view"></div></li>`);
        // attach event
        this.#LABELS.querySelector(':scope > .label:last-child').addEventListener('click', e => {
          e.stopPropagation();
          ConditionBuilder.removeAttributeFilter(this.#condition.attributeId, e.target.parentNode.dataset.node);
        });
      }
    }
    getFilter();
  }

  removeAttribute(conditionAnnotation) {
    const isMatch =
      (conditionAnnotation.attributeId === this.#condition.attributeId) &&
      (conditionAnnotation.parentNode ? conditionAnnotation.parentNode === this.#condition.parentNode : true);
    if (isMatch) this.#ROOT.parentNode.removeChild(this.#ROOT);
    return isMatch;
  }

  removeAttributeFilter(attributeId, node) {
    if (attributeId === this.#condition.attributeId) {
      this.#LABELS.removeChild(this.#LABELS.querySelector(`:scope > [data-node="${node}"`));
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
