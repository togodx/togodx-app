import ConditionResultsController from './ConditionResultsController';
import DefaultEventEmitter from './DefaultEventEmitter';
import ConditionFilterUtility from './ConditionFilterUtility';
import ConditionAnnotationUtility from './ConditionAnnotationUtility';
import * as event from '../events';
import DXCondition from './DXCondition';
import { download } from '../functions/util';
import {Preset} from '../interfaces';

export default class ConditionsController {
  #conditionResultsControllers: ConditionResultsController[];
  #ROOT: HTMLElement;
  #CONDITIONS_CONTAINER: HTMLDivElement;

  constructor(elm: HTMLElement) {
    this.#conditionResultsControllers = [];

    // references
    this.#ROOT = elm;
    this.#CONDITIONS_CONTAINER = elm.querySelector<HTMLDivElement>(':scope > .conditions')!;

    // event listener
    DefaultEventEmitter.addEventListener(
      event.addCondition,
      this.#addConditionResultsController.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      event.sendCondition,
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
    this.#ROOT.querySelectorAll<HTMLButtonElement>(':scope > header > button').forEach(button => {
      button.addEventListener('click', () => {
        switch (button.value) {
          case 'import':
            // TODO: 現在は PresetView 側でクリックイベントをアタッチしている
            break;
          case 'export':
            download(JSON.stringify(this.#conditionResultsControllers.map(crc => crc.preset)), 'json', 'togodx-preset', true);
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
    console.log(preset)
    const dxCondition = new DXCondition(
      preset.condition!.dataset,
      preset.condition!.queries,
      preset.condition!.annotations.
        map(annotation => new ConditionAnnotationUtility(annotation.attribute, annotation.node)),
      preset.condition!.filters.
        map(filter => new ConditionFilterUtility(filter.attribute, filter.nodes)),
      preset.attributeSet
    )
    console.log(dxCondition)
    const controller = new ConditionResultsController(dxCondition, false);
    this.#CONDITIONS_CONTAINER.prepend(controller.element);
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
}
