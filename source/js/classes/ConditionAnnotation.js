import ConditionBase from "./ConditionBase";
import Records from "./Records";

export default class ConditionAnnotation extends ConditionBase {

  #parentNode;
  #filter;
  #ancestors;

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
      attribute: this._attributeId
    };
    if (this.#parentNode) {
      annotation.node = this.#parentNode;
      annotation.path = this.ancestors;
    }
    return annotation;
  }


  // accessor

  get parentNode() {
    return this.#parentNode;
  }

  get ancestors() {
    if (!this.#ancestors) {
      this.#ancestors = Records.getAncestors(this._attributeId, this.#parentNode).map(ancestor => ancestor.node);
    }
    return this.#ancestors;
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

}
