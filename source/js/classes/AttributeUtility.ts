import axios from 'axios';
import {
  AttributesAttribute,
  Breakdown,
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
  #firstLevelNodes: string[] | undefined;
  #cacheNodes: Map<string, Breakdown>; // all nodes
  #cacheNodeRelationship: Map<string | undefined, NodeRelationship>;

  constructor(id: string, attribute: AttributesAttribute) {
    this.#id = id;
    this.#attribute = attribute;
    this.#cacheNodes = new Map();
    this.#cacheNodeRelationship = new Map();
  }

  // public Methods

  async fetchFirstLevelNodes(): Promise<Breakdown[]> {
    if (!this.#firstLevelNodes) {
      const body: BreakdownRequest = {};
      if (this.order) body.order = this.order;
      await axios.post(this.api, body)
        .then(res => {
          const nodes: Breakdown[] = res.data;
          this.#firstLevelNodes = nodes.map(node => node.node);
          for (const node of nodes) {this.#cacheNodes.set(node.node, node)}
        });
    }
    const nodes = this.firstLevelNodes as Breakdown[];
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
    let bhr: BreakdownHierarchyResponse;
    const nodeRelationship = this.#cacheNodeRelationship.get(nodeId);
    if (nodeRelationship) {
      bhr = this.#rebuildHierarchicNode(nodeId as string, nodeRelationship);
    } else {
      const body: BreakdownHierarchyRequest = {
        hierarchy: '',
        node: nodeId,
      };
      bhr = await axios.post(this.api, body).then(res => res.data) as BreakdownHierarchyResponse;
      // cache
      const nodes = [bhr.self];
      if (bhr.parents) nodes.push(...bhr.parents);
      if (bhr.children) nodes.push(...bhr.children);
      nodes.forEach(node => this.#cacheNodes.set(node.node, node));
      if (nodeId) {
        this.#cacheNodeRelationship.set(nodeId, {
          parents: bhr.parents.map(parent => parent.node),
          children: bhr.children.map(child => child.node),
        });
      }
    }
    return Promise.resolve(bhr as BreakdownHierarchyResponse);
  }

  #rebuildHierarchicNode(nodeId: string, nodeRelatinoship: NodeRelationship): BreakdownHierarchyResponse {
    const bhr: BreakdownHierarchyResponse = {
      self: this.#cacheNodes.get(nodeId) as Breakdown,
      parents: nodeRelatinoship.parents.map(parentId => this.#cacheNodes.get(parentId) as Breakdown),
      children: nodeRelatinoship.children.map(childId => this.#cacheNodes.get(childId) as Breakdown),
    }
    return bhr;
  }

  getNode(nodeId: string): Breakdown | undefined {
    console.log(this.#cacheNodes.get(nodeId))
    return this.#cacheNodes.get(nodeId);
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

  // get nodes() {
  //   console.trace('??????', this)
  //   return Array.from(this.#cacheNodes.values());  
  // }

  get firstLevelNodes(): Breakdown[] | undefined {
    if (this.#firstLevelNodes) {
      return this.#firstLevelNodes.map(nodeId => this.#cacheNodes.get(nodeId) as Breakdown);
    } else {
      return undefined;
    }
  }
  
}
