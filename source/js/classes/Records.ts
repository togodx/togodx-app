import Color from 'colorjs.io';
import AttributeUtility from './AttributeUtility.ts';
import { AttributesCategory, AttributesDatasetObject, Breakdown, BreakdownWithParentNode } from '../interfaces.ts';

type SetAttributesArgs = {
  categories: AttributesCategory[];
  attributes: { [key: string]: AttributeUtility };
  datasets: AttributesDatasetObject;
}

class Records {
  #categories: AttributesCategory[] = [];
  #attributes: AttributeUtility[] = [];
  #datasets: AttributesDatasetObject = {};

  // public methods

  setAttributes({categories, attributes, datasets}: SetAttributesArgs ) {
    // define categories

    for (let i = 0; i < categories.length; i++) {
      let hue = 360 - (360 * i) / categories.length + 130;
      hue -= hue > 360 ? 360 : 0;
      const srgb = new Color('hsv', [hue, 45, 85]).to('srgb');
      const srgbStrong = new Color('hsv', [hue, 65, 65]).to('srgb');
      categories[i].hue = hue;
      categories[i].color = srgb;
      categories[i].colorCSSValue = `rgb(${srgb.coords
        .map((channel: number) => channel * 256)
        .join(',')})`;
      categories[i].colorCSSStrongValue = `rgb(${srgbStrong.coords
        .map((channel: number) => channel * 256)
        .join(',')})`;
    }
    this.#categories = categories;
    Object.freeze(this.#categories);

    // set attributes
    this.#attributes = Object.keys(attributes).map(
      (id) => new AttributeUtility(id, attributes[id])
    );
    Object.freeze(this.#attributes);

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
      styleSheet.insertRule(`
      ._category-border-color-strong[data-category-id="${category.id}"], [data-category-id="${category.id}"] ._category-border-color-strong {
        border-color: var(--color-category-${category.id}-strong);
      }`);
    }

    // set datasets
    this.#datasets = datasets;
    Object.freeze(this.#datasets);
  }

  // node

  async fetchParentNodeId(attributeId: string, nodeId: string | undefined): Promise<string> {
    // const attribute = this.getAttribute(attributeId);
    // const filter = attribute.nodes.find(filter => filter.node === node);
    // return filter?.parentNode || '';
    const attribute = this.getAttribute(attributeId);
    await attribute.fetchNode(nodeId);
    return Promise.resolve('123')
  }

  async fetchNode(attributeId: string, nodeId: string): Promise<Breakdown> {
    const attribute = this.getAttribute(attributeId);
    return await attribute.fetchNode(nodeId);
  }

  async fetchChildNodes(attributeId: string, nodeId: string): Promise<Breakdown[]> {
    const attribute = this.getAttribute(attributeId);
    return await attribute.fetchChildNodes(nodeId);
  }

  getNode(attributeId: string, nodeId: string | undefined): BreakdownWithParentNode | undefined {
    const attribute = this.getAttribute(attributeId);
    return attribute.getNode(nodeId);
  }

  // getNodesWithParentNode(attributeId: string, parentNode: string) {
  //   const attribute = this.getAttribute(attributeId);
  //   return attribute.nodes.filter(filter => filter.parentNode === parentNode);
  // }

  getAncestors(attributeId: string, nodeId: string | undefined): Breakdown[] {
    const attribute = this.getAttribute(attributeId);
    const ancestors: Breakdown[] = [];
    let parent: BreakdownWithParentNode | undefined;
    do {
      // find ancestors
      parent = attribute.n__odes.find(filter => filter.node === nodeId);
      if (parent) ancestors.unshift(parent);
      nodeId = parent?.parentNode;
    } while (parent);
    ancestors.pop();
    return ancestors;
  }

  // category

  getCategory(id: string) {
    return this.#categories.find(category => category.id === id);
  }

  getCategoryWithAttributeId(attributeId: string) {
    return this.#categories.find(
      category => category.attributes.indexOf(attributeId) !== -1
    );
  }

  // attribute

  getAttribute(attributeId: string): AttributeUtility {
    return this.#attributes.find(attribute => attribute.id === attributeId)!;
  }

  // dataset

  getDatasetLabel(dataset: string): string {
    return this.#datasets[dataset].label;
  }

  // public accessors

  get categories(): AttributesCategory[] {
    return this.#categories;
  }

  get attributes(): AttributeUtility[] {
    return this.#attributes;
  }
}

export default new Records();
