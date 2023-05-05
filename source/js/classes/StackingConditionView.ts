import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import ConditionFilterUtility from './ConditionFilterUtility';
import ConditionAnnotationUtility from './ConditionAnnotationUtility';

const POLLING_DURATION = 1000;

type ConditionType = 'filter' | 'annotation';

export default class StackingConditionView {
  // #isRange;
  #condition: ConditionFilterUtility | ConditionAnnotationUtility;
  #conditionType: ConditionType;
  #ROOT: HTMLDivElement;
  #LABELS: HTMLUListElement;

  constructor(
    container: HTMLDivElement,
    condition: ConditionFilterUtility | ConditionAnnotationUtility,
    isRange = false
  ) {
    this.#condition = condition;
    this.#conditionType = condition instanceof ConditionFilterUtility ? 'filter' : 'annotation';
    const attribute = Records.getAttribute(condition.attributeId);
    // this.#isRange = isRange;

    // attributes
    this.#ROOT = document.createElement('div');
    this.#ROOT.classList.add(
      'stacking-condition-view',
      '_category-border-color-strong'
    );
    this.#ROOT.dataset.categoryId = condition.categoryId;
    this.#ROOT.dataset.attributeId = condition.attributeId;
    this.#ROOT.dataset.conditionType = this.#conditionType;
    if (condition instanceof ConditionAnnotationUtility && condition.parentNode)
      this.#ROOT.dataset.parentNode = condition.parentNode;
    // make view
    const label: string = this.#conditionType === 'annotation' ? `<div class="label _category-color">${condition.label}</div>` : '<ul class="labels"></ul>'; 
    // switch (true) {
    //   case condition instanceof ConditionAnnotationUtility:
    //     label = `<div class="label _category-color">${condition.label}</div>`;
    //     break;
    //   case condition instanceof ConditionFilterUtility:
    //     label = `<ul class="labels"></ul>`;
    //     break;
    // }
    console.log(label)
    this.#make(container, label);

    // TODO: クリックイベントで当該要素を表示する
  }

  // private methods

  #make(container: HTMLDivElement, label: string) {
    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <p class="attribute _category-color">${this.#condition.attributeLabel}</p>
    ${label}`;
    container.insertAdjacentElement('beforeend', this.#ROOT);
    // reference
    if (this.#condition instanceof ConditionFilterUtility) {
      this.#LABELS = this.#ROOT.querySelector(':scope > .labels')!;
      for (const node of this.#condition.nodes) {
        this.addFilter(node);
      }
    }

    // event
    this.#ROOT
      .querySelector(':scope > .close-button-view')!
      .addEventListener('click', () => {
        switch (true) {
          case this.#condition instanceof ConditionAnnotationUtility:
            // notify
            ConditionBuilder.removeAnnotation(
              new ConditionAnnotationUtility(
                this.#condition.attributeId,
                this.#condition.parentNode
              )
            );
            break;
          case this.#condition instanceof ConditionFilterUtility:
            for (const label of this.#LABELS.querySelectorAll(
              ':scope > .label'
            )) {
              ConditionBuilder.removeFilter(
                this.#condition.attributeId,
                label.dataset.node
              );
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
        this.#LABELS.insertAdjacentHTML(
          'beforeend',
          `<li class="label _category-background-color" data-node="${filter.node}">${filter.label}<div class="close-button-view"></div></li>`
        );
        // attach event
        this.#LABELS
          .querySelector(':scope > .label:last-child')
          .addEventListener('click', e => {
            e.stopPropagation();
            ConditionBuilder.removeFilter(
              this.#condition.attributeId,
              e.target.parentNode.dataset.node
            );
          });
      }
    };
    getFilter();
  }

  removeAnnotation(conditionUtilityAnnotation) {
    const isMatch =
      conditionUtilityAnnotation.attributeId === this.#condition.attributeId &&
      (conditionUtilityAnnotation.parentNode
        ? conditionUtilityAnnotation.parentNode === this.#condition.parentNode
        : true);
    if (isMatch) this.#ROOT.parentNode.removeChild(this.#ROOT);
    return isMatch;
  }

  removeFilter(attributeId, node) {
    if (attributeId === this.#condition.attributeId) {
      this.#LABELS.removeChild(
        this.#LABELS.querySelector(`:scope > [data-node="${node}"`)
      );
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
