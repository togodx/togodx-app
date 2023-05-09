import ConditionUtility from './ConditionUtility';
import Records from './Records';
import {ConditionAnnotationWithAncestor, Breakdown, ConditionAnnotation} from '../interfaces';

export default class ConditionAnnotationUtility extends ConditionUtility {
  #nodeId: string | undefined;
  #filter: Breakdown;

  constructor(attributeId: string, nodeId: string | undefined) {
    super(attributeId);
    this.#nodeId = nodeId;
  }

  // methods

  isSameCondition(attributeId: string, parentNodeId: string | undefined): boolean {
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

  get parentNode(): string | undefined {
    return this.#nodeId;
  }
  get nodeId(): string | undefined {
    return this.#nodeId;
  }

  // get ancestors() {
  //   if (!this.#nodeId) return this.#nodeId;
  //   return this.getAncestors(this.#nodeId);
  // }
  get ancestors(): undefined | string[] {
    if (!this.#nodeId) return undefined;
    return this.getAncestors(this.#nodeId);
  }

  get label(): string {
    if (this.#nodeId) {
      return this.filter.label;
    } else {
      return this.annotation.label;
    }
  }

  get attributeLabel(): string {
    return this.annotation.label;
  }

  get filter(): Breakdown {
    if (!this.#filter) {
      this.#filter = Records.getNode(this._attributeId, this.#nodeId)!;
    }
    return this.#filter;
  }

  get query(): ConditionAnnotation {
    const query: ConditionAnnotation = {
      attribute: this._attributeId,
    };
    if (this.#nodeId) query.node = this.#nodeId;
    return query;
  }

  get conditionAnnotationWithAncestor(): ConditionAnnotationWithAncestor {
    const annotation: ConditionAnnotationWithAncestor = {
      attributeId: this._attributeId,
    };
    if (this.#nodeId) {
      annotation.parentNode = this.#nodeId;
      annotation.ancestors = this.ancestors;
    }
    return annotation;
  }

  // static

  static decodeURLSearchParams(searchParams: string | null): ConditionAnnotationUtility[] {
    const annotations: ConditionAnnotationUtility[] = [];
    const parsed: ConditionAnnotationWithAncestor[] | null = JSON.parse(searchParams || 'null');
    if (parsed) {
      annotations.push(
        ...parsed.map(({attributeId, parentNode, ancestors}) => {
          const ca = new ConditionAnnotationUtility(attributeId, parentNode);
          if (parentNode) ca.setAncestors(parentNode, ancestors!);
          return ca;
        })
      );
    }
    return annotations;
  }
}
