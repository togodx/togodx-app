import AttributeTrackView from './AttributeTrackView.js';
import PresetManager from './PresetManager.ts';
import {AttributesCategory} from '../interfaces.ts';

export default class CategoryView {
  #attributeTrackViews: AttributeTrackView[];
  #lastState: Map<string, boolean> = new Map();
  #ROOT: HTMLElement;

  constructor(category: AttributesCategory, elm: HTMLElement) {
    this.#ROOT = elm;
    elm.classList.add('category-view');
    elm.innerHTML = `
    <h3 class="title _category-background-color-strong" data-category-id="${category.id}">
      <span class="label">${category.label}</span>
      <span class="collapsebutton"></span>
    </h3>
    <div class="attributes"></div>
    <div class="backdrop"></div>`;

    // make tracks
    const attributes = category.attributes;
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
    elm
      .querySelector(':scope > h3 > .collapsebutton')!
      .addEventListener('click', () => {
        elm.classList.add('-editing');
        document.body.dataset.editingCategory = category.id;
        this.#enterAttributesDisplaySettingMode();
        this.#attributeTrackViews.forEach(attributeTrackView =>
          attributeTrackView.makeFilters()
        );
      });
  }

  #enterAttributesDisplaySettingMode() {
    if (!this.#ROOT.querySelector(':scope > .buttons')) this.#makeButtons();
    // aggregate status
    this.#lastState = this.#makeAttributesDisplayStateMap();
  }

  #makeButtons() {
    // make buttons
    this.#ROOT.insertAdjacentHTML(
      'beforeend',
      '<div class="buttons"><button class="rounded-button-view">OK</button><button class="rounded-button-view">Cancel</button></div>'
    );
    // event
    const buttons = this.#ROOT.querySelectorAll(':scope > .buttons > button');
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
