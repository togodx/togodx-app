import Color from "./Color";
import Attribute from "./Attribute";

class Records {
  #catexxxgories;
  #attributes;
  #datasets;

  constructor() {}

  // public methods

  setAttributes({categories, attributes, datasets}) {

    // define categories
    for (let i = 0; i < categories.length; i++) {
      let hue = 360 - (360 * i / categories.length) + 130;
      hue -= hue > 360 ? 360 : 0;
      const srgb = new Color('hsv', [hue, 45, 85]).to('srgb');
      const srgbStrong = new Color('hsv', [hue, 65, 65]).to('srgb');
      categories[i].hue = hue;
      categories[i].color = srgb;
      categories[i].colorCSSValue = `rgb(${srgb.coords.map(channel => channel * 256).join(',')})`;
      categories[i].colorCSSStrongValue = `rgb(${srgbStrong.coords.map(channel => channel * 256).join(',')})`;
    }
    this.#catexxxgories = Object.freeze(categories);

    // set attributes
    this.#attributes = Object.keys(attributes).map(id => new Attribute(id, attributes[id]));

    // make stylesheet
    const styleElm = document.createElement('style');
    document.head.appendChild(styleElm);
    const styleSheet = styleElm.sheet;
    styleSheet.insertRule(`:root {
      ${categories.map(catexxxgory => `
        --color-catexxxgory-${catexxxgory.id}: ${catexxxgory.colorCSSValue};
        --color-catexxxgory-${catexxxgory.id}-strong: ${catexxxgory.colorCSSStrongValue};
        `).join('')}
    }`);
    for (const catexxxgory of categories) {
      styleSheet.insertRule(`
      ._catexxxgory-color[data-catexxxgory-id="${catexxxgory.id}"], [data-catexxxgory-id="${catexxxgory.id}"] ._catexxxgory-color {
        color: var(--color-catexxxgory-${catexxxgory.id}-strong);
      }`);
      styleSheet.insertRule(`
      ._catexxxgory-background-color[data-catexxxgory-id="${catexxxgory.id}"], [data-catexxxgory-id="${catexxxgory.id}"] ._catexxxgory-background-color {
        background-color: var(--color-catexxxgory-${catexxxgory.id});
      }`);
      styleSheet.insertRule(`
      ._catexxxgory-background-color-strong[data-catexxxgory-id="${catexxxgory.id}"], [data-catexxxgory-id="${catexxxgory.id}"] ._catexxxgory-background-color-strong {
        background-color: var(--color-catexxxgory-${catexxxgory.id}-strong);
      }`);
      styleSheet.insertRule(`
      ._catexxxgory-border-color[data-catexxxgory-id="${catexxxgory.id}"], [data-catexxxgory-id="${catexxxgory.id}"] ._catexxxgory-border-color {
        border-color: var(--color-catexxxgory-${catexxxgory.id});
      }`);
    }

    // set datasets
    this.#datasets = datasets;
  }

  fetchAttributeValues(attributeId, node) {
    const attribute = this.getAttribute(attributeId);
    return attribute.fetchValuesWithParentCategoryId(node);
  }

  getCatexxxgory(id) {
    return this.#catexxxgories.find(category => category.id === id);
  }

  getCatexxxgoryWithAttributeId(attributeId) {
    return this.#catexxxgories.find(category => category.attributes.indexOf(attributeId) !== -1);
  }

  getAttribute(attributeId) {
    return this.#attributes.find(attribute => attribute.id === attributeId);
  }

  getValue(attributeId, node) {
    const attribute = this.getAttribute(attributeId);
    return attribute.getValue(node);
  }

  getValuesWithParentCategoryId(attributeId, parentCategoryId) {
    const attribute = this.getAttribute(attributeId);
    return attribute.values.filter(value => value.parentCategoryId === parentCategoryId);
  }

  getAncestors(attributeId, node) {
    const attribute = this.getAttribute(attributeId);
    const ancestors = [];
    let parent;
    do { // find ancestors
      parent = attribute.values.find(value => value.node === node);
      if (parent) ancestors.unshift(parent);
      node = parent?.parentCategoryId;
    } while (parent);
    ancestors.pop();
    return ancestors;
  }

  getDatasetLabel(dataset) {
    return this.#datasets[dataset].label;
  }

  // public accessors

  get catexxxgories() {
    return this.#catexxxgories;
  }

  get attributes() {
    return this.#attributes;
  }
  
}

export default new Records();
