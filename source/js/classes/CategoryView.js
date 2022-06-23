import AttributeTrackView from './AttributeTrackView.js';

export default class CategoryView {

  constructor(category, elm) {
    elm.classList.add('category-view');
    elm.innerHTML = `
    <h3 class="title _category-background-color-strong" data-category-id="${category.id}">
      <span>${category.label}</span>
    </h3>
    <div class="attributes"></div>`;

    // make tracks
    const attributes = category.attributes;
    const attributesContainer = elm.querySelector(':scope > .attributes');
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      new AttributeTrackView(attribute, attributesContainer, i / attributes.length);
    }
  }

}
