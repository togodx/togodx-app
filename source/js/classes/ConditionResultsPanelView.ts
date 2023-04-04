import ConditionResultsController from './ConditionResultsController';
import Records from './Records';

export default class ConditionResultsPanelView {
  #ROOT: HTMLElement;
  #controller: ConditionResultsController;

  constructor(controller: ConditionResultsController) {
    this.#controller = controller;
    this.#ROOT = document.createElement('div');
    // view
    this.#ROOT.classList.add('condition-results-controller-view');
    this.#ROOT.dataset.status = 'load ids';

    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <div class="conditions">
      <div class="condition">
        <p title="${controller.dxCondition.togoKey}">${Records.getDatasetLabel(
      controller.dxCondition.togoKey
    )}</p>
      </div>
      ${controller.dxCondition.conditionFilters
        .map(conditionFilter => {
          const label = Records.getAttribute(conditionFilter.attributeId).label;
          return `<div class="condition _category-background-color" data-category-id="${conditionFilter.categoryId}">
              <p title="${label}">${label}</p>
            </div>`;
        })
        .join('')}
      ${controller.dxCondition.conditionAnnotations
        .map(conditionAnnotation => {
          return `<div class="condition _category-color" data-category-id="${conditionAnnotation.categoryId}">
              <p title="${conditionAnnotation.label}">${conditionAnnotation.label}</p>
            </div>`;
        })
        .join('')}
    </div>
    <div class="status">
      <p>Getting ID list</p>
      <span class="material-icons-outlined -rotating">autorenew</span>
    </div>
    <div class="-border">
    </div>
    <div class="controller">
    </div>
    `;
    
  }

  get element(): HTMLElement {
    return this.#ROOT;
  }
}
