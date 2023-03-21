import AttributeTrackView from './AttributeTrackView.js';

export default class CategoryView {
  #attributeTrackViews;

  constructor(category, elm) {
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
      });
  }
}
