import ConditionResultsController from './ConditionResultsController';
import ProgressIndicator from './ProgressIndicator';
import Records from './Records';

const BUTTONS: string[] = [ 'edit', 'resume', 'tsv', 'retry' ]

/**
 * data-load:
 *   - ids
 *   - properties
 *   - completed
 */

export default class ConditionResultsPanelView {
  #ROOT: HTMLElement;
  #STATUS: HTMLParagraphElement;
  #controller: ConditionResultsController;
  #progressIndicator: ProgressIndicator;

  constructor(controller: ConditionResultsController) {

    this.#controller = controller;
    this.#ROOT = document.createElement('div');
    // view
    this.#ROOT.classList.add('condition-results-panel-view');
    this.#ROOT.dataset.total = '';
    this.#ROOT.dataset.status = 'load ids';
    this.#ROOT.dataset.load = 'ids';

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
    <div class="-border"></div>
    <div class="buttons">
      ${BUTTONS.map(button => `<button data-button="${button}"></button>`).join('')}
    </div>
    <div class="controller"></div>
    `;
    
    // reference
    this.#STATUS = <HTMLParagraphElement>this.#ROOT.querySelector(':scope > .status > p');
    this.#progressIndicator = new ProgressIndicator(
      <HTMLDivElement>this.#ROOT.querySelector(':scope > .status + div')
    );

    // events
    this.#ROOT.querySelectorAll<HTMLButtonElement>(':scope > .buttons > button').forEach(button => {
      button.addEventListener('click', e => {
        e.stopPropagation();
        switch (button.dataset.button) {
          case 'resume':
            this.#pauseOrResume();
            break;
        }
      })
    })
    
  }

  #pauseOrResume() {
    this.#ROOT.classList.toggle('-fetching');
    const isFetching: boolean = this.#ROOT.classList.contains('-fetching');
    this.statusElement.classList.toggle('-flickering');
    this.#controller.pauseOrResume(isFetching);
    this.statusElement.textContent = isFetching
      ? 'Getting data'
      : 'Awaiting';
  }

  loadedIds() {
    this.#ROOT.dataset.total = this.#controller.total;
    this.#ROOT.dataset.status = 'load rows';
    this.#ROOT.dataset.load = 'properties';
    this.#STATUS.textContent = 'Getting data';
    this.#progressIndicator.setIndicator(undefined, this.#controller.total);
  }

  loadedProperties() {

  }

  get element(): HTMLElement {
    return this.#ROOT;
  }
  get statusElement(): HTMLParagraphElement {
    return this.#STATUS;
  }
  get progressIndicator(): ProgressIndicator {
    return this.#progressIndicator;
  }
}
