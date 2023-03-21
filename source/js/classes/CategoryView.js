import AttributeTrackView from './AttributeTrackView.js';

export default class CategoryView {
  #attributeTrackViews;
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
        new AttributeTrackView(attribute, container, i / attributes.length)
    );

    // event
    elm
      .querySelector(':scope > h3 > .collapsebutton')
      .addEventListener('click', () => {
        elm.classList.toggle('-editing');
        this.#setupButtons();
      });
  }

  #setupButtons() {
    if (this.#ROOT.querySelector(':scope > .buttons')) return;
    this.#ROOT.insertAdjacentHTML(
      'beforeend',
      '<div class="buttons"><button class="rounded-button-view">OK</button><button class="rounded-button-view">Cancel</button></div>'
    );
  }
}
