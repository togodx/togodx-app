import Color from "./Color";
import Attribute from "./Attribute";

class Records {
  #catexxxgories;
  #attributes;
  #datasets;
  #properties;
  // #fetchedCategoryIds;

  constructor() {}

  // public methods

  setSubjects(subjects, {categories, attributes, datasets}) {

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

    // set properties
    this.#properties = [];
    // this.#fetchedCategoryIds = {};
    subjects.forEach(subject => {
      subject.properties.forEach(property => {
        this.#properties.push(Object.assign({
          catexxxgoryId: subject.subjectId,
          values: []
        }, property));
        // this.#fetchedCategoryIds[property.propertyId] = [];
      });
    });

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
  }

  setDatasets({tracks, attributes, datasets}) {
    // TODO:
    this.#datasets = datasets;
  }

  fetchAttributeValues(attributeId, categoryId) {
    const attribute = this.getAttribute(attributeId);
    return attribute.fetchValuesWithParentCategoryId(categoryId);
  }

  getCatexxxgory(id) {
    return this.#catexxxgories.find(category => category.id === id);
  }

  getCatexxxgoryWithAttribute(attribute) {
    return this.#catexxxgories.find(category => category.attributes.indexOf(attribute) !== -1);
  }

  getAttribute(attributeId) {
    return this.#attributes.find(attribute => attribute.id === attributeId);
  }

  getProperty(propertyId) {
    const property = this.#properties.find(property => property.propertyId === propertyId);
    return property;
  }

  getValue(propertyId, categoryId) {
    const property = this.getProperty(propertyId);
    const value = property.values.find(value => value.categoryId === categoryId);
    return value;
  }

  getValuesWithParentCategoryId(propertyId, parentCategoryId) {
    const property = this.getProperty(propertyId);
    return property.values.filter(value => value.parentCategoryId === parentCategoryId);
  }

  getAncestors(propertyId, categoryId) {
    const property = this.getProperty(propertyId);
    const ancestors = [];
    let parent;
    do { // find ancestors
      parent = property.values.find(value => value.categoryId === categoryId);
      if (parent) ancestors.unshift(parent);
      categoryId = parent?.parentCategoryId;
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

  get properties() {
    return this.#properties;
  }
}

export default new Records();
