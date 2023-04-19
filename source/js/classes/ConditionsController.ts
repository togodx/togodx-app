import ConditionResultsController from './ConditionResultsController';
import DefaultEventEmitter from './DefaultEventEmitter';
import * as event from '../events';
import DXCondition from './DXCondition';

export default class ConditionsController {
  #conditionResultsControllers: ConditionResultsController[];
  #ROOT: HTMLSelectElement;
  #CONDITIONS_CONTAINER: HTMLDivElement;

  constructor(elm: HTMLSelectElement) {
    this.#conditionResultsControllers = [];

    // references
    this.#ROOT = elm;
    this.#CONDITIONS_CONTAINER = elm.querySelector<HTMLDivElement>(':scope > .conditions')!;

    // event listener
    DefaultEventEmitter.addEventListener(
      event.completeQueryParameter,
      this.#setConditionResultsController.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      event.selectConditionResults,
      this.#selectConditionResultsController.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      event.deleteConditionResults,
      this.#deleteConditionResultsController.bind(this)
    );

    // event
    console.log(this.#ROOT.querySelectorAll(':scope > header > button'))
    this.#ROOT.querySelectorAll(':scope > header > button').forEach(button => {
      button.addEventListener('click', e => {
        console.log(button)
      });
    })

    // observe number of conditions
    const config = {attributes: false, childList: true, subtree: false};
    const callback = () => {
      this.#ROOT.dataset.numberOfConditions =
        this.#CONDITIONS_CONTAINER.childNodes.length.toString();
    };
    const observer = new MutationObserver(callback);
    observer.observe(this.#CONDITIONS_CONTAINER, config);
  }

  /* private methods */

  #setConditionResultsController(e: CustomEvent) {
    const dxCondition: DXCondition = e.detail;
    // find matching condition from already existing conditions
    const sameConditionConditionResultsController =
      this.#conditionResultsControllers.find(conditionResults =>
        conditionResults.dxCondition.checkSameCondition(dxCondition)
      );
    if (sameConditionConditionResultsController) {
      // use existing table data
      sameConditionConditionResultsController.select();
    } else {
      // make new table data
      const controller = new ConditionResultsController(dxCondition);
      this.#CONDITIONS_CONTAINER.prepend(controller.element);
      this.#conditionResultsControllers.push(controller);
    }
  }

  #selectConditionResultsController(e: CustomEvent) {
    const selectedConditionResultsController: ConditionResultsController =
      e.detail;
    document.body.dataset.display = 'results';
    // deselect
    for (const conditionResults of this.#conditionResultsControllers) {
      if (conditionResults !== selectedConditionResultsController)
        conditionResults.deselect();
    }
  }

  #deleteConditionResultsController(e: CustomEvent) {
    const controller: ConditionResultsController = e.detail;
    const index = this.#conditionResultsControllers.indexOf(controller);
    this.#conditionResultsControllers.splice(index, 1);
  }
}
