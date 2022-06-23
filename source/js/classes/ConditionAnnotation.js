import ConditionBase from "./ConditionBase";
import Records from "./Records";

export default class ConditionAnnotation extends ConditionBase {

  #parentNode;
  #filter;

  constructor(attributeId, parentNode) {
    super(attributeId);
    this.#parentNode = parentNode;
  }


  // methods
  
  /**
   * 
   * @param {String} attributeId 
   * @param {String} parentNode 
   * @return {Boolean}
   */
  isSameCondition(attributeId, parentNode) {
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
  

  getURLParameter() {
    const annotation = {
      attributeId: this._attributeId
    };
    if (this.#parentNode) {
      annotation.parentNode = this.#parentNode;
      annotation.ancestors = this.ancestors;
    }
    return annotation;
  }


  // accessor

  get parentNode() {
    return this.#parentNode;
  }

  get ancestors() {
    if (!this.#parentNode) return this.#parentNode;
    return this.getAncestors(this.#parentNode);
  }

  get label() {
    if (this.#parentNode) {
      return this.filter.label;
    } else {
      return this.annotation.label;
    }
  }

  get filter() {
    if (!this.#filter) {
      this.#filter = Records.getFilter(this._attributeId, this.#parentNode);
    }
    return this.#filter;
  }

  get query() {
    const query = {
      attribute: this._attributeId
    };
    if (this.#parentNode) query.node = this.#parentNode;
    return query;
  }


  // static
  
  static decodeURLSearchParams(searchParams) {
    const annotations = [];
    const parsed = JSON.parse(searchParams);
    if (parsed) {
      annotations.push(
        ...parsed.map(({attributeId, parentNode, ancestors}) => {
          const annotation = new ConditionAnnotation(attributeId, parentNode);
          annotation.setAncestors(parentNode, ancestors);
          return annotation;
        })
      )
    }
    return annotations;
  }

}
