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

  async fetchChildNodes(nodeId: string): Promise<Breakdown[]> {
    let nodes = this.#nodes.filter(
      node => node.parentNode === nodeId
    );
    if (nodes.length === 0) {
      const body: BreakdownRequest = {};
      if (nodeId) body.node = nodeId;
      if (this.order) body.order = this.order;
      nodes = await axios.post(this.api, body).then(res => {
        nodes = res.data;
        // set parent node
        if (nodeId)
          nodes.forEach(node => (node.parentNode = nodeId));
        // set nodes
        this.#nodes.push(...nodes);
        return res.data;
      })
    }
    return Promise.resolve(nodes);
  }

  async fetchNode(nodeId: string | undefined): Promise<Breakdown> {
    const bhr = await this.#fetchHierarchicNode(nodeId);
    return Promise.resolve(bhr.self);
  }

  async #fetchHierarchicNode(nodeId: string | undefined): Promise<BreakdownHierarchyResponse> {
    let bhr = this.#cache.get(nodeId);
    if (!bhr) {
      const body: BreakdownHierarchyRequest = {
        hierarchy: '',
        node: nodeId,
      };
      bhr = await axios.post(this.api, body).then(res => res.data) as BreakdownHierarchyResponse;
      this.#cache.set(nodeId, bhr);
    }
    return Promise.resolve(bhr);
  }

  getNode(nodeId: string | undefined): BreakdownWithParentNode | undefined {
    return this.#nodes.find(node => node.node === nodeId);
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
