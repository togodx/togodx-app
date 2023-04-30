import ConditionUtility from './ConditionUtility';
import Records from './Records';
import {
  ConditionFilterWithAncestor,
  ConditionFilterWithAncestorNode,
  ConditionFilter,
} from '../interfaces';

export default class ConditionFilterUtility extends ConditionUtility {
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

  get conditionFilterWithAncestor(): ConditionFilterWithAncestor {
    const cfwa: ConditionFilterWithAncestor = {
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
      cfwa.nodes.push(node2);
    });
    return cfwa;
  }

  // static

  static decodeURLSearchParams(
    searchParams: string | null
  ): ConditionFilterUtility[] {
    const filters: ConditionFilterUtility[] = [];
    const parsed: ConditionFilterWithAncestor[] = JSON.parse(
      searchParams || 'null'
    );
    if (parsed) {
      filters.push(
        ...parsed.map(({attributeId, nodes}) => {
          const cf = new ConditionFilterUtility(
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
