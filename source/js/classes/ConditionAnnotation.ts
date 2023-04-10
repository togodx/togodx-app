import ConditionBase from './ConditionBase';
import Records from './Records';
import {ConditionAnnotationValue, Breakdown, ConditionAnnotationQuery} from '../interfaces';

export default class ConditionAnnotation extends ConditionBase {
  #parentNode: string | undefined;
  #filter: Breakdown;

  constructor(attributeId: string, parentNode: string | undefined) {
    super(attributeId);
    this.#parentNode = parentNode;
  }

  // methods

  isSameCondition(attributeId: string, parentNode: string): boolean {
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

  getURLParameter(): ConditionAnnotationValue {
    const annotation: ConditionAnnotationValue = {
      attributeId: this._attributeId,
    };
    if (this.#parentNode) {
      annotation.parentNode = this.#parentNode;
      annotation.ancestors = this.ancestors;
    }
    return annotation;
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

  get query(): ConditionAnnotationQuery {
    const query: ConditionAnnotationQuery = {
      attribute: this._attributeId,
    };
    if (this.#parentNode) query.node = this.#parentNode;
    return query;
  }

  // static

  static decodeURLSearchParams(searchParams: string): ConditionAnnotation[] {
    const annotations: ConditionAnnotation[] = [];
    const parsed: ConditionAnnotationValue[] = JSON.parse(searchParams);
    if (parsed) {
      annotations.push(
        ...parsed.map(({attributeId, parentNode, ancestors}) => {
          const ca = new ConditionAnnotation(attributeId, parentNode);
          if (parentNode) ca.setAncestors(parentNode, ancestors!);
          return ca;
        })
      );
    }
    return annotations;
  }
}
