import Color from 'colorjs.io';
import AttributeUtility from './AttributeUtility';
import { Breakdown } from '../interfaces';

class Records {
  #categories;
  #attributes: AttributeUtility[];
  #datasets;

  constructor() {}

  // public methods

  setAttributes({categories, attributes, datasets}) {
    // define categories
    for (let i = 0; i < categories.length; i++) {
      let hue = 360 - (360 * i) / categories.length + 130;
      hue -= hue > 360 ? 360 : 0;
      const srgb = new Color('hsv', [hue, 45, 85]).to('srgb');
      const srgbStrong = new Color('hsv', [hue, 65, 65]).to('srgb');
      categories[i].hue = hue;
      categories[i].color = srgb;
      categories[i].colorCSSValue = `rgb(${srgb.coords
        .map(channel => channel * 256)
        .join(',')})`;
      categories[i].colorCSSStrongValue = `rgb(${srgbStrong.coords
        .map(channel => channel * 256)
        .join(',')})`;
    }
    this.#categories = Object.freeze(categories);

    // set attributes
    this.#attributes = Object.keys(attributes).map(
      id => new AttributeUtility(id, attributes[id])
    );

    // make stylesheet
    const styleElm = document.createElement('style');
    document.head.appendChild(styleElm);
    const styleSheet = styleElm.sheet!;
    styleSheet.insertRule(`:root {
      ${categories
        .map(
          category => `
        --color-category-${category.id}: ${category.colorCSSValue};
        --color-category-${category.id}-strong: ${category.colorCSSStrongValue};
        `
        )
        .join('')}
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

    // set datasets
    this.#datasets = datasets;
  }

  fetchAttributeFilters(attributeId, node) {
    const attribute = this.getAttribute(attributeId);
    return attribute.fetchFiltersWithParentNode(node);
  }

  getCategory(id) {
    return this.#categories.find(category => category.id === id);
  }

  getCategoryWithAttributeId(attributeId) {
    return this.#categories.find(
      category => category.attributes.indexOf(attributeId) !== -1
    );
  }

  getAttribute(attributeId: string): AttributeUtility | undefined {
    return this.#attributes.find(attribute => attribute.id === attributeId);
  }

  getFilter(attributeId: string, node: string | undefined) {
    const attribute = this.getAttribute(attributeId);
    return attribute.getFilter(node);
  }

  getFiltersWithParentNode(attributeId: string, parentNode: string) {
    const attribute = this.getAttribute(attributeId);
    return attribute.filters.filter(filter => filter.parentNode === parentNode);
  }

  getAncestors(attributeId: string, node: string): Breakdown[] {
    const attribute = this.getAttribute(attributeId)!;
    const ancestors = [];
    let parent: AttributeUtility | undefined;
    do {
      // find ancestors
      parent = attribute.filters.find(filter => filter.node === node);
      if (parent) ancestors.unshift(parent);
      node = parent?.parentNode;
    } while (parent);
    ancestors.pop();
    return ancestors;
  }

  async getParentNode(attributeId: string, node: string | undefined): Promise<string> {
    // const attribute = this.getAttribute(attributeId);
    // const filter = attribute.filters.find(filter => filter.node === node);
    // return filter?.parentNode || '';
    return Promise.resolve('123')
  }

  getDatasetLabel(dataset) {
    return this.#datasets[dataset].label;
  }

  // public accessors

  get categories() {
    return this.#categories;
  }

  get attributes(): AttributeUtility[] {
    return this.#attributes;
  }
}

export default new Records();
