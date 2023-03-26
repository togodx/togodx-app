import AttributeTrackView from './AttributeTrackView.js';
import AttributesManager from './AttributesManager';

export default class CategoryView {
  #attributeTrackViews;
  #lastState;
  #ROOT;

  constructor(category, elm) {
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
          AttributesManager.containsInDisplayedAttributes(attribute),
          i / attributes.length
        )
    );

    // event
    elm
      .querySelector(':scope > h3 > .collapsebutton')
      .addEventListener('click', () => {
        elm.classList.add('-editing');
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
    buttons.forEach((button, i) => {
      button.addEventListener('click', e => {
        switch (i) {
          case 0: // ok
            {
              // set local storage
              AttributesManager.update(this.#makeAttributesDisplayStateMap());
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
        this.#ROOT.classList.remove('-editing');
      });
    });
  }

  #makeAttributesDisplayStateMap() {
    const stateMap = new Map();
    this.#attributeTrackViews.forEach(attributeTrackView => {
      stateMap.set(attributeTrackView.id, attributeTrackView.visibility);
    });
    return stateMap;
  }
}
