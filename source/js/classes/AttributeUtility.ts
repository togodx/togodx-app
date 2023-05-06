import axios from 'axios';
import {
  AttributesAttribute,
  Breakdown,
  BreakdownWithParentNode,
  BreakdownHierarchyRequest,
  BreakdownHierarchyResponse,
} from '../interfaces';

interface BreakdownRequest {
  node?: string;
  order?: string;
}

export default class AttributeUtility {
  #id: string;
  #attribute: AttributesAttribute;
  #filters: BreakdownWithParentNode[];
  #cache: Map<string | undefined, BreakdownHierarchyResponse>;

  constructor(id: string, attribute: AttributesAttribute) {
    this.#id = id;
    this.#attribute = attribute;
    this.#filters = [];
    this.#cache = new Map();
  }

  // public Methods

  async fetchChildNodes(node: string): Promise<Breakdown[]> {
    let filters = this.#filters.filter(
      filter => filter.parentNode === node
    );
    if (filters.length === 0) {
      const body: BreakdownRequest = {};
      if (node) body.node = node;
      if (this.order) body.order = this.order;
      filters = await axios.post(this.api, body).then(res => {
        filters = res.data;
        // set parent node
        if (node)
          filters.forEach(filter => (filter.parentNode = node));
        // set filters
        this.#filters.push(...filters);
        return res.data;
      })
    }
    return Promise.resolve(filters);
  }

  async fetchNode(node: string | undefined): Promise<BreakdownHierarchyResponse> {
    let res = this.#cache.get(node);
    if (!res) {
      const body: BreakdownHierarchyRequest = {
        hierarchy: '',
        node,
      };
      res = await axios.post(this.api, body).then(res => res.data) as BreakdownHierarchyResponse;
      this.#cache.set(node, res);
    }
    return Promise.resolve(res);
  }

  getFilter(node: string): BreakdownWithParentNode | undefined {
    return this.#filters.find(filter => filter.node === node);
  }

  // accessors

  get id() {
    return this.#id;
  }

  get label() {
    return this.#attribute.label;
  }

  get description() {
    return this.#attribute.description;
  }

  get api() {
    return this.#attribute.api;
  }

  get dataset() {
    return this.#attribute.dataset;
  }

  get datamodel() {
    return this.#attribute.datamodel;
  }

  get source() {
    return this.#attribute.source;
  }

  get order() {
    return this.#attribute.order;
  }

  get filters() {
    return this.#filters;
  }
}
