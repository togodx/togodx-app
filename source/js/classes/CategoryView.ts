import AttributeTrackView from './AttributeTrackView.js';
import PresetManager from './PresetManager.ts';
import {AttributesCategory} from '../interfaces.ts';

export default class CategoryView {
  #category: AttributesCategory;
  #attributeTrackViews: AttributeTrackView[];
  #lastState: Map<string, boolean> = new Map();
  #boundEventHandler: any;
  #ROOT: HTMLElement;

  constructor(category: AttributesCategory, elm: HTMLElement) {

    this.#category = category;
    this.#ROOT = elm;
    elm.classList.add('category-view');
    elm.innerHTML = `
    <div class="selectall">
      <input type="checkbox" id="category-${category.id}-selectall">
      <label for="category-${category.id}-selectall">Select all / Unselect All</label>
    </div>
    <h3 class="title _category-background-color-strong" data-category-id="${category.id}">
      <span class="label">${this.#category.label}</span>
      <span class="collapsebutton"></span>
    </h3>
    <div class="attributes"></div>
    <div class="backdrop"></div>`;

    // make tracks
    const attributes = this.#category.attributes;
    const container = elm.querySelector(':scope > .attributes');
    this.#attributeTrackViews = attributes.map(
      (attribute, i) =>
        new AttributeTrackView(
          attribute,
          container,
          PresetManager.containsInDisplayedAttributes(attribute),
          i / attributes.length
        )
    );

    // event
    const collapsebutton = elm.querySelector(':scope > h3 > .collapsebutton') as HTMLButtonElement;
    collapsebutton.addEventListener('click', () => {
      if (elm.classList.contains('-editing')) {
        this.#leaveAttributesDisplaySettingMode();
      } else {
        this.#enterAttributesDisplaySettingMode();
      }
    });
  }

  #enterAttributesDisplaySettingMode() {
    this.#ROOT.classList.add('-editing');
    document.body.dataset.editingCategory = this.#category.id;
    if (!this.#ROOT.querySelector(':scope > .buttons')) this.#makeButtons();
    // save status
    this.#lastState = this.#makeAttributesDisplayStateMap();
    // load filters
    this.#attributeTrackViews.forEach(attributeTrackView =>
      attributeTrackView.makeFilters()
    );
    // key event
    this.#boundEventHandler = this.#keydown.bind(this);
    document.addEventListener('keydown', this.#boundEventHandler);
  }

  #leaveAttributesDisplaySettingMode() {
    document.body.dataset.editingCategory = '';
    this.#ROOT.classList.remove('-editing');
    document.removeEventListener('keydown', this.#boundEventHandler);
  }

  #keydown(e: KeyboardEvent) {
    if (e.key === 'Escape') this.#leaveAttributesDisplaySettingMode();
  }

  #makeButtons() {
    // make buttons
    this.#ROOT.insertAdjacentHTML(
      'beforeend',
      '<div class="buttons"><button class="rounded-button-view">OK</button><button class="rounded-button-view">Cancel</button></div>'
    );
    // event
    const buttons = this.#ROOT.querySelectorAll<HTMLButtonElement>(':scope > .buttons > button');
    buttons.forEach((button: HTMLButtonElement, i: number) => {
      button.addEventListener('click', () => {
        switch (i) {
          case 0: // ok
            {
              // set local storage
              PresetManager.updateByDifferenceData(
                this.#makeAttributesDisplayStateMap()
              );
            }
            break;
          case 1: // cancel
            // return to state
            this.#attributeTrackViews.forEach(attributeTrackView => {
              attributeTrackView.visibility = this.#lastState.get(
                attributeTrackView.id
              );
            });
            break;
        }
        document.body.dataset.editingCategory = '';
        this.#ROOT.classList.remove('-editing');
      });
    });
  }

  #makeAttributesDisplayStateMap(): Map<string, boolean> {
    const stateMap = new Map();
    this.#attributeTrackViews.forEach(attributeTrackView => {
      stateMap.set(attributeTrackView.id, attributeTrackView.visibility);
    });
    return stateMap;
  }
}
