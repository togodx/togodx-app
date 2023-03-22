import AttributeTrackView from './AttributeTrackView.js';

export default class CategoryView {
  #attributeTrackViews;
  #lastStatus;
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
    console.log(this.#attributeTrackViews);

    // event
    elm
      .querySelector(':scope > h3 > .collapsebutton')
      .addEventListener('click', () => {
        elm.classList.add('-editing');
        this.#setupButtons();
      });
  }

  #setupButtons() {
    if (!this.#ROOT.querySelector(':scope > .buttons')) {
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
              // set local storage
              break;
            case 1: // cancel
              // return to state
              this.#attributeTrackViews.forEach(attributeTrackView => {
                attributeTrackView.visibility = this.#lastStatus.get(
                  attributeTrackView.id
                );
              });
              break;
          }
          this.#ROOT.classList.remove('-editing');
        });
      });
    }
    // aggregate status
    this.#lastStatus = new Map();
    this.#attributeTrackViews.forEach(attributeTrackView => {
      console.log(attributeTrackView);
      this.#lastStatus.set(
        attributeTrackView.id,
        attributeTrackView.visibility
      );
    });
    console.log(this.#lastStatus);
  }
}
