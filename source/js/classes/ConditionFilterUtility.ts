import ConditionUtility from './ConditionUtility.ts';
import Records from './Records.ts';
import {ConditionFilter} from '../interfaces.ts';

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
    return this.attribute.label;
  }
  fetchLabel(): Promise<string> {
    return Promise.resolve(this.attribute.label);
  }

  get attributeLabel(): string {
    return this.attribute.label;
  }

  get query(): ConditionFilter {
    return {
      attribute: this._attributeId,
      nodes: this.nodes,
    };
  }

  // static

  static decodeURLSearchParams(
    searchParams: string | null
  ): ConditionFilterUtility[] {
    const filters: ConditionFilterUtility[] = [];
    const parsed: ConditionFilter[] = JSON.parse(searchParams || 'null');
    if (parsed) {
      filters.push(
        ...parsed.map(({attribute, nodes}) => {
          const cf = new ConditionFilterUtility(attribute, nodes);
          return cf;
        })
      );
    }
    return filters;
  }
}
