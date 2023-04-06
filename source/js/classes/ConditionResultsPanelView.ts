import ConditionResultsController from './ConditionResultsController';
import ProgressIndicator from './ProgressIndicator';
import Records from './Records';

const BUTTONS: string[] = [ 'resume', 'retry', 'tsv', 'condition', 'edit' ]

interface ConditionResultsControllerStatus {
  total: number;
  current: number;
}

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
  #statusProxy: ConditionResultsControllerStatus;

  constructor(controller: ConditionResultsController) {

    this.#controller = controller;
    this.#ROOT = document.createElement('div');
    // view
    this.#ROOT.classList.add('condition-results-panel-view', '-loading');
    // this.#ROOT.dataset.currentCount = '0';
    // this.#ROOT.dataset.totalCount = '';
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
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, tsv], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const timeStamp = new Date();
    const [date, time] = [
      timeStamp.toISOString().slice(0, 10).replace(/-/g, ''),
      timeStamp.toLocaleTimeString().replace(/:/g, ''),
    ];
    anchor.href = url;
    anchor.download = `togodx-${date}-${time}.tsv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
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

  #loadedIds(count: number): void {
    this.#ROOT.dataset.totalCount = count.toString();
    if (count > 0) {
      this.#ROOT.dataset.status = 'load rows';
      this.#ROOT.dataset.load = 'properties';
      this.#STATUS.textContent = 'Getting data';
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
    this.#ROOT.dataset.status = 'complete';
    this.#ROOT.dataset.load = 'completed';
    this.#STATUS.textContent = this.#statusProxy.total === 0
      ? 'Complete'
      : 'No Data Found';
    this.#ROOT.classList.remove('-loading');
  }

  get element(): HTMLElement {
    return this.#ROOT;
  }
  get statusElement(): HTMLParagraphElement {
    return this.#STATUS;
  }
  // set sum(sum: number) {
  //   this.#ROOT.dataset.sum = sum.toString();
  // }
}
