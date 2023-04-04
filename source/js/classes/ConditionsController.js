import ConditionResultsController from './ConditionResultsController';
import DefaultEventEmitter from './DefaultEventEmitter';
import * as event from '../events';

export default class ConditionsController {
  #conditionResultsController;
  #ROOT;
  #CONDITIONS_CONTAINER;

  constructor(elm) {
    this.#conditionResultsController = [];

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
      this.#conditionResultsController.find(conditionResults =>
        conditionResults.dxCondition.checkSameCondition(dxCondition)
      );
    if (sameConditionConditionResultsController) {
      // use existing table data
      sameConditionConditionResultsController.select();
    } else {
      // make new table data
      const elm = document.createElement('div');
      this.#CONDITIONS_CONTAINER.insertAdjacentElement('afterbegin', elm);
      this.#conditionResultsController.push(
        new ConditionResultsController(dxCondition, elm)
      );
    }
  }

  #selectConditionResultsController(selectedConditionResultsController) {
    document.body.dataset.display = 'results';
    // deselect
    for (const conditionResults of this.#conditionResultsController) {
      if (conditionResults !== selectedConditionResultsController)
        conditionResults.deselect();
    }
  }

  #deleteConditionResultsController(conditionResults) {
    const index = this.#conditionResultsController.indexOf(conditionResults);
    this.#conditionResultsController.splice(index, 1);
  }
}
