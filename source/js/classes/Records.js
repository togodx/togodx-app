import Color from "./Color";
import Attribute from "./Attribute";

class Records {
  #categories;
  #attributes;
  #datasets;
  #properties;
  #fetchedCategoryIds;

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
    this.#categories = Object.freeze(categories);

    // set attributes
    this.#attributes = Object.keys(attributes).map(id => new Attribute(id, attributes[id]));

    // set properties
    this.#properties = [];
    this.#fetchedCategoryIds = {};
    subjects.forEach(subject => {
      subject.properties.forEach(property => {
        this.#properties.push(Object.assign({
          subjectId: subject.subjectId,
          values: []
        }, property));
        this.#fetchedCategoryIds[property.propertyId] = [];
      });
    });

    // make stylesheet
    const styleElm = document.createElement('style');
    document.head.appendChild(styleElm);
    const styleSheet = styleElm.sheet;
    styleSheet.insertRule(`:root {
      ${categories.map(category => `
        --color-category-${category.id}: ${category.colorCSSValue};
        --color-category-${category.id}-strong: ${category.colorCSSStrongValue};
        `).join('')}
    }`);
    for (const category of categories) {
      styleSheet.insertRule(`
      ._category-color[data-category-id="${category.id}"], [data-category-id="${category.id}"] ._category-color {
        color: var(--color-category-${category.id}-strong);
      }`);
      styleSheet.insertRule(`
      ._category-background-color[data-category-id="${category.id}"], [data-category-id="${category.id}"] ._category-background-color {
        background-color: var(--color-category-${category.id});
      }`);
      styleSheet.insertRule(`
      ._category-background-color-strong[data-category-id="${category.id}"], [data-category-id="${category.id}"] ._category-background-color-strong {
        background-color: var(--color-category-${category.id}-strong);
      }`);
      styleSheet.insertRule(`
      ._category-border-color[data-category-id="${category.id}"], [data-category-id="${category.id}"] ._category-border-color {
        border-color: var(--color-category-${category.id});
      }`);
    }
  }

  setDatasets({tracks, attributes, datasets}) {
    // TODO:
    this.#datasets = datasets;
  }

  fetchPropertyValues(propertyId, categoryId) {
    const property = this.getProperty(propertyId);
    return new Promise((resolve, reject) => {
      if (categoryId && property.values.findIndex(value => value.parentCategoryId === categoryId) !== -1) {
        resolve(property.values.filter(value => value.parentCategoryId === categoryId));
      } else {
        fetch(`${property.data}${categoryId ? `?categoryIds=${categoryId}` : ''}`)
        .then(responce => responce.json())
        .then(values => {
          // set parent category id
          if (categoryId) values.forEach(value => value.parentCategoryId = categoryId);
          // set values
          property.values.push(...values);
          resolve(values);
        })
        .catch(error => reject(error));
      }
    });
  }

  getCategory(id) {
    return this.#categories.find(category => category.id === id);
  }

  getCategoryWithAttribute(attribute) {
    return this.#categories.find(category => category.attributes.indexOf(attribute) !== -1);
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

  get categories() {
    return this.#categories;
  }

  get properties() {
    return this.#properties;
  }
}

export default new Records();
