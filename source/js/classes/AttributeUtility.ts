import axios from 'axios';
import {
  AttributesAttribute,
  Breakdown,
  BreakdownWithParentNode,
  BreakdownHierarchyRequest,
  BreakdownHierarchyResponse,
} from '../interfaces.ts';

interface BreakdownRequest {
  node?: string;
  order?: string;
}
interface NodeRelationship {
  parents: string[];
  children: string[];
}

export default class AttributeUtility {
  #id: string;
  #attribute: AttributesAttribute;
  #n__odes: BreakdownWithParentNode[]; // top level nodes
  #cache: Map<string | undefined, BreakdownHierarchyResponse>;
  #cacheNodes: Map<string, Breakdown>; // all nodes
  #cacheNodeRelationship: Map<string, NodeRelationship>;

  constructor(id: string, attribute: AttributesAttribute) {
    this.#id = id;
    this.#attribute = attribute;
    this.#n__odes = [];
    this.#cache = new Map();
    this.#cacheNodes = new Map();
    this.#cacheNodeRelationship = new Map();
  }

  // public Methods

  async fetchChildNodes(nodeId: string): Promise<Breakdown[]> {
    let nodes = this.#n__odes.filter(
      node => node.parentNode === nodeId
    );
    if (nodes.length === 0) {
      const body: BreakdownRequest = {};
      if (nodeId) body.node = nodeId;
      if (this.order) body.order = this.order;
      nodes = await axios.post(this.api, body).then(res => {
        nodes = res.data;
        console.log('***********', nodes);
        // cache
        nodes.forEach(node => this.#cacheNodes.set(node.node, node));
        // set nodes (compatibility)
        this.#n__odes.push(...nodes.map(node => {
          const node2 = Object.assign({}, node);
          if (nodeId) node2.parentNode = nodeId;
          return node2;
        }));
        // // set parent node
        // if (nodeId)
        //   nodes.forEach(node => (node.parentNode = nodeId));
        // // set nodes
        // this.#n__odes.push(...nodes);
        return res.data;
      })
    }
    return Promise.resolve(nodes);
  }

  async fetchNode(nodeId: string | undefined): Promise<Breakdown> {
    switch (this.#attribute.datamodel) {
      case 'classification': {
        const bhr = await this.fetchHierarchicNode(nodeId);
        return Promise.resolve(bhr.self);
      }
      case 'distribution': {
        return Promise.resolve(this.getNode(nodeId) as Breakdown);
      }
    }
  }

  async fetchHierarchicNode(nodeId: string | undefined): Promise<BreakdownHierarchyResponse> {
    let bhr = this.#cache.get(nodeId);
    if (!bhr) {
      const body: BreakdownHierarchyRequest = {
        hierarchy: '',
        node: nodeId,
      };
      bhr = await axios.post(this.api, body).then(res => res.data) as BreakdownHierarchyResponse;
      // cache
      this.#cache.set(nodeId, bhr);
      console.log(this.#cache)
      const nodes = [...bhr.parents, bhr.self, ...bhr.children];
      console.log(nodes)
      nodes.forEach(node => this.#cacheNodes.set(node.node, node));
      console.log(this.#cacheNodes)
      if (nodeId) {
        this.#cacheNodeRelationship.set(nodeId, {
          parents: bhr.parents.map(parent => parent.node),
          children: bhr.children.map(child => child.node),
        });
        console.log(this.#cacheNodeRelationship)
      }
    }
    return Promise.resolve(bhr);
  }

  getNode(nodeId: string): Breakdown | undefined {
    console.log(this.#cacheNodes.get(nodeId))
    return this.#cacheNodes.get(nodeId);
    // return this.#n__odes.find(node => node.node === nodeId);
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
    console.trace('??????', this)
    return Array.from(this.#cacheNodes.values());  
  }

  get n__odes() {
    console.trace('!!!!!!', this)
    return this.#n__odes;
  }
}
