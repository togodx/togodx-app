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

    // get label
    const attribute = Records.getAttribute(this.#condition.attributeId);
    let label: string = '';
    if (this.#condition instanceof ConditionAnnotationUtility) {
      if (this.#condition.nodeId) {
        const node = await attribute.fetchNode(this.#condition.nodeId)
        label = node.label;
      } else {
        label = attribute.label;
      }
    }

    // make view
    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <p class="attribute _category-color">${this.#condition.attributeLabel}</p>
    ${this.#conditionType === 'annotation' 
      ? `<div class="label _category-color">${label}</div>` 
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
    const node = await Records.fetchNode(this.#condition.attributeId, nodeId);
    console.log(node)
    const li = document.createElement('li');
    li.classList.add('label', '_category-background-color');
    li.dataset.node = node.node;
    li.innerHTML = `${node.label}<div class="close-button-view"></div>`;
    this.#LABELS.append(li);

    // const getNode = () => {
    //   const node = Records.getNode(this.#condition.attributeId, nodeId);
    //   console.log(node)
    //   if (node === undefined) {
    //     setTimeout(getNode, POLLING_DURATION);
    //   } else {
    //     this.#LABELS.insertAdjacentHTML(
    //       'beforeend',
    //       `<li class="label _category-background-color" data-node="${node.node}">${node.label}<div class="close-button-view"></div></li>`
    //     );
    //     // attach event
    //     this.#LABELS
    //       .querySelector<HTMLLIElement>(':scope > .label:last-child')!
    //       .addEventListener('click', e => {
    //         e.stopPropagation();
    //         ConditionBuilder.removeFilter(
    //           this.#condition.attributeId,
    //           e.target!.parentNode.dataset.node
    //         );
    //       });
    //   }
    // };
    // getNode();
  }

  removeAnnotation(conditionUtilityAnnotation) {
    const isMatch =
      conditionUtilityAnnotation.attributeId === this.#condition.attributeId &&
      (conditionUtilityAnnotation.nodeId
        ? conditionUtilityAnnotation.nodeId === (this.#condition as ConditionAnnotationUtility).nodeId
        : true);
    if (isMatch) this.#ROOT.remove();
    return isMatch;
  }

  removeFilter(attributeId, node) {
    if (attributeId === this.#condition.attributeId) {
      this.#LABELS.removeChild(
        this.#LABELS.querySelector(`:scope > [data-node="${node}"`)
      );
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

  sameAttribute(attributeId) {
    return attributeId === this.#condition.attributeId;
  }
}
