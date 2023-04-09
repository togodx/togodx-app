import ConditionBase from './ConditionBase';
import Records from './Records';

export default class ConditionFilter extends ConditionBase {
  #nodes; // string[]

  constructor(attributeId, nodes) {
    super(attributeId);
    this.#nodes = nodes;
  }

  // methods

  addNode(node) {
    this.#nodes.push(node);
  }

  removeNode(node) {
    const index = this.#nodes.indexOf(node);
    this.#nodes.splice(index, 1);
  }

  getURLParameter() {
    const values = {
      attributeId: this._attributeId,
      nodes: [],
    };
    this.#nodes.forEach(node => {
      const node2 = {node};
      const ancestors = Records.getAncestors(this._attributeId, node).map(
        ancestor => ancestor.node
      );
      if (ancestors.length > 0) node2.ancestors = ancestors;
      values.nodes.push(node2);
    });
    return values;
  }

  // accessor

  /**
   * @return {string[]}
   */
  get nodes() {
    return this.#nodes;
  }

  get label() {
    return this.annotation.label;
  }

  get query() {
    return {
      attribute: this._attributeId,
      nodes: this.nodes,
    };
  }

  // static

  static decodeURLSearchParams(searchParams) {
    const filters = [];
    const parsed = JSON.parse(searchParams);
    if (parsed) {
      filters.push(
        ...parsed.map(({attributeId, nodes}) => {
          const cf = new ConditionFilter(
            attributeId,
            nodes.map(node => node.node)
          );
          nodes.forEach(({node, ancestors}) => {
            if (ancestors) {
              cf.setAncestors(node, ancestors);
            }
          });
          return cf;
        })
      );
    }
    return filters;
  }
}
