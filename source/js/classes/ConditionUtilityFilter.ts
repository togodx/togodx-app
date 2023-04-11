import ConditionUtilityBase from './ConditionUtilityBase';
import Records from './Records';
import {
  ConditionFilterWithAncestor,
  ConditionFilterWithAncestorNode,
  ConditionFilter,
} from '../interfaces';

export default class ConditionFilter extends ConditionUtilityBase {
  #nodes: string[];

  constructor(attributeId: string, nodes: string[]) {
    super(attributeId);
    this.#nodes = nodes;
  }

  // methods

  addNode(node: string): void {
    this.#nodes.push(node);
  }

  removeNode(node: string): void {
    const index = this.#nodes.indexOf(node);
    this.#nodes.splice(index, 1);
  }

  getURLParameter(): ConditionFilterWithAncestor {
    const value: ConditionFilterWithAncestor = {
      attributeId: this._attributeId,
      nodes: [],
    };
    this.#nodes.forEach(node => {
      const node2: ConditionFilterWithAncestorNode = {node};
      const ancestors: string[] = Records.getAncestors(
        this._attributeId,
        node
      ).map(ancestor => ancestor.node);
      if (ancestors.length > 0) node2.ancestors = ancestors;
      value.nodes.push(node2);
    });
    return value;
  }

  // accessor

  /**
   * @return {string[]}
   */
  get nodes(): string[] {
    return this.#nodes;
  }

  get label(): string {
    return this.annotation.label;
  }

  get query(): ConditionFilter {
    return {
      attribute: this._attributeId,
      nodes: this.nodes,
    };
  }

  // static

  static decodeURLSearchParams(searchParams: string): ConditionFilter[] {
    const filters: ConditionFilter[] = [];
    const parsed: ConditionFilterWithAncestor[] = JSON.parse(searchParams);
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
