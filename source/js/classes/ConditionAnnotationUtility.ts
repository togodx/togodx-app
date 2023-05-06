import ConditionUtility from './ConditionUtility';
import Records from './Records';
import {ConditionAnnotationWithAncestor, Breakdown, ConditionAnnotation} from '../interfaces';

export default class ConditionAnnotationUtility extends ConditionUtility {
  #node: string | undefined;
  #filter: Breakdown;

  constructor(attributeId: string, node: string | undefined) {
    super(attributeId);
    console.log(attributeId, node);
    this.#node = node;

    // get parent node
    // console.log(Records.fetchParentNode(attributeId, node!));
    
  }

  // methods

  isSameCondition(attributeId: string, parentNode: string | undefined): boolean {
    if (attributeId === this._attributeId) {
      if (parentNode) {
        return parentNode === this.#node;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  // accessor

  get parentNode(): string | undefined {
    return this.#node;
  }

  // get ancestors() {
  //   if (!this.#node) return this.#node;
  //   return this.getAncestors(this.#node);
  // }
  get ancestors(): undefined | string[] {
    if (!this.#node) return undefined;
    return this.getAncestors(this.#node);
  }

  get label(): string {
    console.log(this.#node)
    if (this.#node) {
      console.log(this)
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
      this.#filter = Records.getNode(this._attributeId, this.#node)!;
    }
    console.log(this.#filter)
    return this.#filter;
  }

  get query(): ConditionAnnotation {
    const query: ConditionAnnotation = {
      attribute: this._attributeId,
    };
    if (this.#node) query.node = this.#node;
    return query;
  }

  get conditionAnnotationWithAncestor(): ConditionAnnotationWithAncestor {
    const annotation: ConditionAnnotationWithAncestor = {
      attributeId: this._attributeId,
    };
    if (this.#node) {
      annotation.parentNode = this.#node;
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
