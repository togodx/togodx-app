import ConditionBuilder from './ConditionBuilder';
import Records from './Records';
import ConditionFilterUtility from './ConditionFilterUtility';
import ConditionAnnotationUtility from './ConditionAnnotationUtility';

const POLLING_DURATION = 1000;

export default class StackingConditionView {
  // #isRange;
  #condition: ConditionFilterUtility | ConditionAnnotationUtility;
  #ROOT: HTMLDivElement;
  #LABELS: HTMLUListElement;

  constructor(
    container: HTMLDivElement,
    condition: ConditionFilterUtility | ConditionAnnotationUtility,
    isRange = false
  ) {
    this.#condition = condition;
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
    if (condition instanceof ConditionAnnotationUtility && condition.parentNode)
      this.#ROOT.dataset.parentNode = condition.parentNode;
    // make view
    let label: string,
      ancestorLabels = [Records.getCategory(condition.categoryId).label];
    switch (true) {
      case condition instanceof ConditionAnnotationUtility:
        {
          if (
            condition instanceof ConditionAnnotationUtility &&
            condition.parentNode
          ) {
            const getFilter = () => {
              try {
                const filter = condition.filter;
                label = `<div class="label _category-color">${filter.label}</div>`;
                ancestorLabels.push(
                  attribute.label,
                  ...condition.ancestors.map(ancestor => {
                    return Records.getFilter(condition.attributeId, ancestor)
                      .label;
                  })
                );
                this.#make(container, ancestorLabels, label);
              } catch (e) {
                setTimeout(getFilter, POLLING_DURATION);
              }
            };
            getFilter();
          } else {
            label = `<div class="label _category-color">${attribute.label}</div>`;
            this.#make(container, ancestorLabels, label);
          }
        }
        break;
      case this.#condition instanceof ConditionFilterUtility:
        label = `<ul class="labels"></ul>`;
        ancestorLabels.push(attribute.label);
        this.#make(container, ancestorLabels, label);
        break;
    }

    // TODO: クリックイベントで当該要素を表示する
  }

  // private methods

  #make(container: HTMLDivElement, ancestorLabels, label: string) {
    // this.#ROOT.innerHTML = `
    // <div class="close-button-view"></div>
    // <ul class="path _category-color">
    //   ${ancestorLabels.map(ancestor => `<li>${ancestor}</li>`).join('')}
    // </ul>
    // ${label}`;
    console.log(this.#condition);
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
