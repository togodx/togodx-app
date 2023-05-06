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
  #nodes: BreakdownWithParentNode[];
  #cache: Map<string | undefined, BreakdownHierarchyResponse>;

  constructor(id: string, attribute: AttributesAttribute) {
    this.#id = id;
    this.#attribute = attribute;
    this.#nodes = [];
    this.#cache = new Map();
  }

  // public Methods

  async fetchChildNodes(node: string): Promise<Breakdown[]> {
    let nodes = this.#nodes.filter(
      node2 => node2.parentNode === node
    );
    if (nodes.length === 0) {
      const body: BreakdownRequest = {};
      if (node) body.node = node;
      if (this.order) body.order = this.order;
      nodes = await axios.post(this.api, body).then(res => {
        nodes = res.data;
        // set parent node
        if (node)
          nodes.forEach(node2 => (node2.parentNode = node));
        // set nodes
        this.#nodes.push(...nodes);
        return res.data;
      })
    }
    return Promise.resolve(nodes);
  }

  async fetchHierarchicNode(node: string | undefined): Promise<BreakdownHierarchyResponse> {
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

  getNode(node: string | undefined): BreakdownWithParentNode | undefined {
    return this.#nodes.find(node2 => node2.node === node);
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

  get nodes() {
    return this.#nodes;
  }
}
