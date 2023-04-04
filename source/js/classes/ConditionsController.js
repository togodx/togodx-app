import ConditionResultsController from './ConditionResultsController';
import DefaultEventEmitter from './DefaultEventEmitter';
import * as event from '../events';

export default class ConditionsController {
  #conditionResultsControllers;
  #ROOT;
  #CONDITIONS_CONTAINER;

  constructor(elm) {
    this.#conditionResultsControllers = [];

    // references
    this.#ROOT = elm;
    this.#CONDITIONS_CONTAINER = elm.querySelector(':scope > .conditions');

    // event listener
    DefaultEventEmitter.addEventListener(event.completeQueryParameter, e =>
      this.#setConditionResultsController(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.selectConditionResults, e =>
      this.#selectConditionResultsController(e.detail)
    );
    DefaultEventEmitter.addEventListener(event.deleteConditionResults, e =>
      this.#deleteConditionResultsController(e.detail)
    );

    // observe number of conditions
    const config = {attributes: false, childList: true, subtree: false};
    const callback = () => {
      this.#ROOT.dataset.numberOfConditions =
        this.#CONDITIONS_CONTAINER.childNodes.length;
    };
    const observer = new MutationObserver(callback);
    observer.observe(this.#CONDITIONS_CONTAINER, config);
  }

  /* private methods */

  /**
   *
   * @param {DXCondition} dxCondition
   */
  #setConditionResultsController(dxCondition) {
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

  #selectConditionResultsController(selectedConditionResultsController) {
    document.body.dataset.display = 'results';
    // deselect
    for (const conditionResults of this.#conditionResultsControllers) {
      if (conditionResults !== selectedConditionResultsController)
        conditionResults.deselect();
    }
  }

  #deleteConditionResultsController(conditionResults) {
    const index = this.#conditionResultsControllers.indexOf(conditionResults);
    this.#conditionResultsControllers.splice(index, 1);
  }
}
