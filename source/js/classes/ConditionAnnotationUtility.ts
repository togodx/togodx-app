import ConditionUtility from './ConditionUtility';
import Records from './Records';
import {ConditionAnnotationWithAncestor, Breakdown, ConditionAnnotation} from '../interfaces';

export default class ConditionAnnotationUtility extends ConditionUtility {
  #parentNode: string | undefined;
  #filter: Breakdown;

  constructor(attributeId: string, parentNode: string | undefined) {
    super(attributeId);
    this.#parentNode = parentNode;
  }

  // methods

  isSameCondition(attributeId: string, parentNode: string | undefined): boolean {
    if (attributeId === this._attributeId) {
      if (parentNode) {
        return parentNode === this.#parentNode;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  // accessor

  get parentNode(): string | undefined {
    return this.#parentNode;
  }

  // get ancestors() {
  //   if (!this.#parentNode) return this.#parentNode;
  //   return this.getAncestors(this.#parentNode);
  // }
  get ancestors(): undefined | string[] {
    if (!this.#parentNode) return undefined;
    return this.getAncestors(this.#parentNode);
  }

  get label(): string {
    if (this.#parentNode) {
      return this.filter.label;
    } else {
      return this.annotation.label;
    }
  }

  get filter(): Breakdown {
    if (!this.#filter) {
      this.#filter = Records.getFilter(this._attributeId, this.#parentNode);
    }
    return this.#filter;
  }

  get query(): ConditionAnnotation {
    const query: ConditionAnnotation = {
      attribute: this._attributeId,
    };
    if (this.#parentNode) query.node = this.#parentNode;
    return query;
  }

  get conditionAnnotationWithAncestor(): ConditionAnnotationWithAncestor {
    const annotation: ConditionAnnotationWithAncestor = {
      attributeId: this._attributeId,
    };
    if (this.#parentNode) {
      annotation.parentNode = this.#parentNode;
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
