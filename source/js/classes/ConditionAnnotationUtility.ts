import ConditionUtility from './ConditionUtility.ts';
import Records from './Records.ts';
import {Breakdown, ConditionAnnotation} from '../interfaces.ts';

export default class ConditionAnnotationUtility extends ConditionUtility {
  #nodeId: string | undefined;
  #node: Breakdown | undefined;

  constructor(attributeId: string, nodeId?: string) {
    super(attributeId);
    console.trace(attributeId, nodeId);
    this.#nodeId = nodeId;
  }

  // methods

  isSameCondition(attributeId: string, parentNodeId?: string): boolean {
    if (attributeId === this._attributeId) {
      if (parentNodeId) {
        return parentNodeId === this.#nodeId;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  // accessor

  // get parentNode(): string | undefined {
  //   return this.#nodeId;
  // }
  get nodeId(): string | undefined {
    return this.#nodeId;
  }

  get label(): string | undefined {
    if (this.#nodeId) {
      const node = Records.getNode(this._attributeId, this.#nodeId);
      return node?.label;
    } else {
      return this.attribute.label;
    }
  }
  async fetchLabel(): Promise<string> {
    if (this.#nodeId) {
      const node = await this.attribute.fetchNode(this.#nodeId);
      return Promise.resolve(node.label);
    } else {
      return Promise.resolve(this.attribute.label);
    }
  }

  get attributeLabel(): string {
    return this.attribute.label;
  }

  // get filter(): Breakdown {
  //   if (!this.#node) {
  //     this.#node = Records.getNode(this._attributeId, this.#nodeId);
  //   }
  //   return this.#node;
  // }

  get query(): ConditionAnnotation {
    const query: ConditionAnnotation = {
      attribute: this._attributeId,
    };
    if (this.#nodeId) query.node = this.#nodeId;
    return query;
  }

  // static

  static decodeURLSearchParams(
    searchParams: string | null
  ): ConditionAnnotationUtility[] {
    const annotations: ConditionAnnotationUtility[] = [];
    const parsed: ConditionAnnotation[] | null = JSON.parse(
      searchParams || 'null'
    );
    if (parsed) {
      annotations.push(
        ...parsed.map(({attribute, node}) => {
          const ca = new ConditionAnnotationUtility(attribute, node);
          return ca;
        })
      );
    }
    return annotations;
  }
}
