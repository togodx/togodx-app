import ConditionResultsController from './ConditionResultsController.ts';
import DefaultEventEmitter from './DefaultEventEmitter.ts';
import ConditionFilterUtility from './ConditionFilterUtility.ts';
import ConditionAnnotationUtility from './ConditionAnnotationUtility.ts';
import DXCondition from './DXCondition.ts';
import * as events from '../events';
import { download } from '../functions/util.ts';
import {Preset} from '../interfaces.ts';

export default class ConditionsController {
  #conditionResultsControllers: ConditionResultsController[];
  #ROOT: HTMLElement;
  #CONDITIONS_CONTAINER: HTMLDivElement;

  constructor(elm: HTMLElement) {
    this.#conditionResultsControllers = [];

    // references
    this.#ROOT = elm;
    this.#CONDITIONS_CONTAINER = elm.querySelector(':scope > .conditions') as HTMLDivElement;

    // event listener
    DefaultEventEmitter.addEventListener(
      events.addCondition,
      <EventListener>this.#addConditionResultsController.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      events.sendCondition,
      <EventListener>this.#setConditionResultsController.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      events.selectConditionResults,
      <EventListener>this.#selectConditionResultsController.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      events.deleteConditionResults,
      <EventListener>this.#deleteConditionResultsController.bind(this)
    );

    // event
    this.#ROOT.querySelectorAll<HTMLButtonElement>(':scope > header > button').forEach(button => {
      button.addEventListener('click', () => {
        switch (button.value) {
          case 'import':
            // TODO: 現在は PresetView 側でクリックイベントをアタッチしている
            break;
          case 'export':
            download(JSON.stringify(this.#conditionResultsControllers.map(crc => crc.preset)), 'json', 'togodx-preset', true);
            break;
          case 'clear':
            this.#deleteAllConditions();
            break;
        }
      });
    });

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

  #addConditionResultsController(e: CustomEvent) {
    const preset: Preset = e.detail;
    if (!preset.condition) return;
    const dxCondition = new DXCondition(
      preset.condition.dataset,
      preset.condition.queries,
      preset.condition.annotations.
        map(annotation => new ConditionAnnotationUtility(annotation.attribute, annotation.node)),
      preset.condition.filters.
        map(filter => new ConditionFilterUtility(filter.attribute, filter.nodes)),
      preset.attributeSet
    )
    const controller = new ConditionResultsController(dxCondition, false);
    this.#CONDITIONS_CONTAINER.prepend(controller.element);
    this.#conditionResultsControllers.unshift(controller);
  }

  #setConditionResultsController(e: CustomEvent) {
    const dxCondition: DXCondition = e.detail;
    // find matching condition from already existing conditions
    const sameConditionConditionResultsController =
      this.#conditionResultsControllers.find(conditionResults =>
        conditionResults.dxCondition.checkSameCondition(dxCondition)
      );
    console.log(sameConditionConditionResultsController)
    if (sameConditionConditionResultsController) {
      // use existing table data
      sameConditionConditionResultsController.select();
    } else {
      // make new table data
      const controller = new ConditionResultsController(dxCondition, true);
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

  #deleteAllConditions() {
    while (this.#conditionResultsControllers.length > 0) {
      this.#conditionResultsControllers[0].delete();
    }
  }
}
