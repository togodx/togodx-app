import ConditionBase from "./ConditionBase";
import Records from "./Records";

export default class ConditionAnnotation extends ConditionBase {

  #parentNode;
  #value;
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
      attributeId: this._attributeId
    };
    if (this.#parentNode) {
      annotation.id = {
        node: this.#parentNode,
        ancestors: this.ancestors
      }
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
      return this.value.label;
    } else {
      return this.annotation.label;
    }
  }

  get value() {
    if (!this.#value) {
      this.#value = Records.getValue(this._attributeId, this.#parentNode);
    }
    return this.#value;
  }

  get query() {
    const query = {
      attribute: this._attributeId
    };
    if (this.#parentNode) query.node = this.#parentNode;
    return query;
  }

}
