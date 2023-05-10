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
    if (condition instanceof ConditionAnnotationUtility && condition.nodeId)
      this.#ROOT.dataset.parentNode = condition.nodeId;

    // make view
    this.#makeHTML(container);
  }


  // private methods

  async #makeHTML(container: HTMLDivElement) {

    // make view
    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <p class="attribute _category-color">${this.#condition.attributeLabel}</p>
    ${this.#conditionType === 'annotation' 
      ? `<div class="label _category-color">${await this.#condition.fetchLabel()}</div>` 
      : '<ul class="labels"></ul>'}
    `;
    container.append(this.#ROOT);

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
            {
              // notify
              ConditionBuilder.removeAnnotation(
                new ConditionAnnotationUtility(
                  this.#condition.attributeId,
                  (this.#condition as ConditionAnnotationUtility).nodeId
                )
              );
            }
            break;
          case this.#condition instanceof ConditionFilterUtility:
            for (const label of this.#LABELS.querySelectorAll<HTMLLIElement>(
              ':scope > .label'
            )) {
              ConditionBuilder.removeFilter(
                this.#condition.attributeId,
                label.dataset.node!
              );
            }
            break;
        }
      });
  }


  // public methods

  async addFilter(nodeId: string) {

    // make element
    const node = await Records.fetchNode(this.#condition.attributeId, nodeId);
    const li = document.createElement('li');
    li.classList.add('label', '_category-background-color');
    li.dataset.node = node.node;
    li.innerHTML = `${node.label}<div class="close-button-view"></div>`;
    this.#LABELS.append(li);

    // attach event
    li.querySelector(':scope > .close-button-view')!.addEventListener('click', e => {
      e.stopPropagation();
      ConditionBuilder.removeFilter(
        this.#condition.attributeId,
        li.dataset.node!
      );
    });
  }

  removeAnnotation(cua: ConditionAnnotationUtility): boolean {
    const isMatch =
      cua.attributeId === this.#condition.attributeId &&
      (cua.nodeId
        ? cua.nodeId === (this.#condition as ConditionAnnotationUtility).nodeId
        : true);
    if (isMatch) this.#ROOT.remove();
    return isMatch;
  }

  removeFilter(attributeId: string, node: string): boolean {
    if (attributeId === this.#condition.attributeId) {
      this.#LABELS.querySelector(`:scope > [data-node="${node}"`)?.remove();
      if (this.#LABELS.childNodes.length === 0) {
        this.#ROOT.remove();
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  sameAttribute(attributeId: string) {
    return attributeId === this.#condition.attributeId;
  }
}
