import ConditionResultsController from './ConditionResultsController';
import ProgressIndicator from './ProgressIndicator';
import Records from './Records';
import ConditionBuilder from './ConditionBuilder';
import PresetManager from './PresetManager';
import { download } from '../functions/util';
import { Preset } from '../interfaces';

const BUTTONS: string[] = [ 'resume', 'retry', 'tsv', 'condition', 'edit' ]

interface ConditionResultsControllerStatus {
  total: number;
  current: number;
}

// export enum LoadStatus {
//   ids = 'ids',
//   properties = 'properties',
//   completed = 'completed',
// }

type LoadStatus = 'ids' | 'properties' | 'completed';

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
    this.#ROOT.classList.add('condition-results-panel-view');
    // this.#ROOT.dataset.currentCount = '0';
    // this.#ROOT.dataset.totalCount = '';
    this.#ROOT.dataset.load = 'ids';

    this.#makeHTML();
  }

  async #makeHTML(): Promise<void> {

    // get annotation labels
    const annotationLabels: string[] = [];
    for (const cua of this.#controller.dxCondition.conditionUtilityAnnotations) {
      annotationLabels.push(await cua.fetchLabel());
    }

    // make html
    this.#ROOT.innerHTML = `
    <div class="close-button-view"></div>
    <div class="conditions">
      <div class="condition">
        <p title="${this.#controller.dxCondition.togoKey}">${Records.getDatasetLabel(
      this.#controller.dxCondition.togoKey
    )}</p>
      </div>
      ${this.#controller.dxCondition.conditionUtilityFilters
        .map(conditionUtilityFilter => {
          const label = Records.getAttribute(conditionUtilityFilter.attributeId)!.label;
          return `<div class="condition _category-background-color" data-category-id="${conditionUtilityFilter.categoryId}">
              <p title="${label}">${label}</p>
            </div>`;
        })
        .join('')}
      ${this.#controller.dxCondition.conditionUtilityAnnotations
        .map((conditionUtilityAnnotation, i) => {
          return `<div class="condition _category-color" data-category-id="${conditionUtilityAnnotation.categoryId}">
              <p title="${annotationLabels[i]}">${annotationLabels[i]}</p>
            </div>`;
        })
        .join('')}
    </div>
    <div class="status">
      <p></p>
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
    download(JSON.stringify([this.preset]), 'json', 'togodx-preset', true);
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
    this.#ROOT.classList.add('-error');
    this.#ROOT.classList.remove('-loading');
  }

  loadIds():void {
    // this.#ROOT.dataset.load = 'ids';
    this.#ROOT.classList.add('-loading');
  }

  #loadedIds(count: number): void {
    this.#ROOT.dataset.totalCount = count.toString();
    if (count > 0) {
      this.#ROOT.dataset.load = 'properties';
      this.#progressIndicator.setIndicator(undefined, count);
    } else {
      this.#completed();
    }
  }

  #loadedProperties(count: number): void {
    this.#progressIndicator.updateProgressBar(count);
    if (this.#statusProxy.total === count) this.#completed();
  }

  #completed(): void {
    this.#ROOT.dataset.load = 'completed';
    this.#ROOT.classList.remove('-loading');
  }


  // accessors

  get element(): HTMLElement {
    return this.#ROOT;
  }
  get loadStatus(): LoadStatus {
    const loadStatus = <LoadStatus>this.#ROOT.dataset.load!;
    // const values = Object.values(LoadStatus);
    // if (values.includes(loadStatus)) return loadStatus;
    // else throw new Error('invalid load status');
    return loadStatus;
  }
  get preset(): Preset {
    return {
      condition: {
        dataset: this.#controller.dxCondition.togoKey,
        // filters: this.#controller.dxCondition.conditionUtilityFilters.map(cuf => cuf.conditionFilterWithAncestor),
        // annotations: this.#controller.dxCondition.conditionUtilityAnnotations.map(cua => cua.conditionAnnotationWithAncestor),
        filters: this.#controller.dxCondition.conditionUtilityFilters.map(cuf => cuf.query),
        annotations: this.#controller.dxCondition.conditionUtilityAnnotations.map(cua => cua.query),
        queries: ConditionBuilder.userIds,
      },
      attributeSet: PresetManager.currentAttributeSet
    };
  }
  set selected(isSelected: boolean) {
    this.#ROOT.classList.toggle('-current', isSelected);
  }

}
