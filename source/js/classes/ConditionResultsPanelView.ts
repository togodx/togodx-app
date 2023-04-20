import ConditionResultsController from './ConditionResultsController';
import ProgressIndicator from './ProgressIndicator';
import Records from './Records';
import ConditionBuilder from './ConditionBuilder';
import AttributesManager from './AttributesManager';
import {download} from '../functions/util';
import {
  SynthesizedCondition,
} from '../interfaces';

const BUTTONS: string[] = [ 'resume', 'retry', 'tsv', 'condition', 'edit' ]

interface ConditionResultsControllerStatus {
  total: number;
  current: number;
}

export enum LoadStatus {
  ids = 'ids',
  properties = 'properties',
  completed = 'completed',
}

export default class ConditionResultsPanelView {
  #ROOT: HTMLElement;
  #STATUS: HTMLParagraphElement;
  #controller: ConditionResultsController;
  #progressIndicator: ProgressIndicator;
  #statusProxy: ConditionResultsControllerStatus;

  constructor(controller: ConditionResultsController) {

    this.#controller = controller;
    this.#ROOT = document.createElement('div');
    // view
    this.#ROOT.classList.add('condition-results-panel-view', '-loading');
    // this.#ROOT.dataset.currentCount = '0';
    // this.#ROOT.dataset.totalCount = '';
    this.#ROOT.dataset.load = LoadStatus.ids;

    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <div class="conditions">
      <div class="condition">
        <p title="${controller.dxCondition.togoKey}">${Records.getDatasetLabel(
      controller.dxCondition.togoKey
    )}</p>
      </div>
      ${controller.dxCondition.conditionUtilityFilters
        .map(conditionUtilityFilter => {
          const label = Records.getAttribute(conditionUtilityFilter.attributeId)!.label;
          return `<div class="condition _category-background-color" data-category-id="${conditionUtilityFilter.categoryId}">
              <p title="${label}">${label}</p>
            </div>`;
        })
        .join('')}
      ${controller.dxCondition.conditionUtilityAnnotations
        .map(conditionUtilityAnnotation => {
          return `<div class="condition _category-color" data-category-id="${conditionUtilityAnnotation.categoryId}">
              <p title="${conditionUtilityAnnotation.label}">${conditionUtilityAnnotation.label}</p>
            </div>`;
        })
        .join('')}
    </div>
    <div class="status">
      <p>Getting ID list</p>
      <span class="material-icons -rotating">autorenew</span>
    </div>
    <div class="-border"></div>
    <div class="buttons">
      ${BUTTONS.map(button => `<button data-button="${button}"></button>`).join('')}
    </div>
    `;
    
    // reference
    this.#STATUS = <HTMLParagraphElement>this.#ROOT.querySelector(':scope > .status > p');
    this.#progressIndicator = new ProgressIndicator(
      <HTMLDivElement>this.#ROOT.querySelector(':scope > .status + div')
    );

    // events
    this.#ROOT.addEventListener('click', () => {
      if (this.#ROOT.classList.contains('-current')) return;
      this.#controller.select();
    });
    const closeButton = this.#ROOT.querySelector(':scope > .close-button-view') as HTMLDivElement;
    closeButton.addEventListener('click', e => {
        e.stopPropagation();
        // delete element
        this.#ROOT.remove();
        this.#controller.deleteCondition();
      });
    this.#ROOT.querySelectorAll<HTMLButtonElement>(':scope > .buttons > button').forEach(button => {
      button.addEventListener('click', e => {
        e.stopPropagation();
        switch (button.dataset.button) {
          case 'resume':
            this.#pauseOrResume();
            break;
          case 'tsv':
            this.#downloadTSV();
            break;
          case 'condition':
            this.#downloadCondition();
            break;
          case 'edit':
            this.#controller.edit();
            break;
        }
      })
    })
    
  }

  #pauseOrResume(): void {
    this.#ROOT.classList.toggle('-loading');
    const isLoading: boolean = this.#ROOT.classList.contains('-loading');
    this.#controller.pauseOrResume(isLoading);
    this.#STATUS.textContent = isLoading
      ? 'Getting data'
      : 'Awaiting';
  }

  #downloadTSV(): void {
    const data = this.#controller.data;
    const tsv: string = [
      [
        'orig_dataset',
        'orig_entry',
        'orig_label',
        'dest_dataset',
        'dest_entry',
        'node',
        'value',
      ].join('\t'),
      ...data
        .map(row => {
          return row.attributes
            .map(attribute => {
              return attribute.items.map(item => {
                return [
                  this.#controller.togoKey, // orig_dataset
                  row.index.entry, // orig_entry
                  row.index.label, // orig_label
                  item.dataset, // dest_dataset
                  item.entry, // dest_entry
                  attribute.id, // node
                  item.label, // value
                ].join('\t');
              });
            })
            .flat();
        })
        .flat(),
    ].join('\n');
    download(tsv, 'tsv', 'togodx', true);
  }

  #downloadCondition(): void {
    const condition: SynthesizedCondition = {
      dataset: this.#controller.dxCondition.togoKey,
      filters: this.#controller.dxCondition.conditionUtilityFilters.map(cuf => cuf.conditionFilterWithAncestor),
      annotations: this.#controller.dxCondition.conditionUtilityAnnotations.map(cua => cua.conditionAnnotationWithAncestor),
      queries: ConditionBuilder.userIds,
      attributeSet: AttributesManager.currentSet
    };
    download(JSON.stringify([condition]), 'json', 'togodx-condition', true);
  }

  controllerStatusProxy(status) {
    const self = this;
    this.#statusProxy = new Proxy(status, {
      get(target, property, receiver) {
        // console.log(target, property, receiver)
        return Reflect.get(target, property, receiver);
      },
      set(target, property, value, receiver) {
        // console.log(target, property, value, receiver)
        // console.log(status)
        switch (property) {
          case 'total': 
            self.#loadedIds(value);
            break;
          case 'current': 
            self.#loadedProperties(value);
            break;
        }
        return Reflect.set(target, property, value, receiver);
      }
    })
    return this.#statusProxy;
  }

  displayError(message: string, code: number): void {
    this.#STATUS.innerHTML = `<span class="error">${code
      ? `${message} (${code})`
      : message}</span>`;
    this.#ROOT.classList.remove('-loading');
  }

  #loadedIds(count: number): void {
    this.#ROOT.dataset.totalCount = count.toString();
    if (count > 0) {
      this.#ROOT.dataset.load = LoadStatus.properties;
      this.#STATUS.textContent = 'Getting data';
      this.#progressIndicator.setIndicator(undefined, count);
    } else {
      this.#completed('No Data Found');
    }
  }

  #loadedProperties(count: number): void {
    this.#progressIndicator.updateProgressBar(count);
    if (this.#statusProxy.total === count) this.#completed();
  }

  #completed(message: string = 'Complete'): void {
    this.#ROOT.dataset.load = LoadStatus.completed;
    this.#STATUS.textContent = message;
    this.#ROOT.classList.remove('-loading');
  }

  get element(): HTMLElement {
    return this.#ROOT;
  }
  get loadStatus(): LoadStatus {
    const loadStatus = <LoadStatus>this.#ROOT.dataset.load!;
    const values = Object.values(LoadStatus);
    if (values.includes(loadStatus)) return loadStatus;
    else throw new Error('invalid load status');
  }
  set selected(isSelected: boolean) {
    this.#ROOT.classList.toggle('-current', isSelected);
  }

}