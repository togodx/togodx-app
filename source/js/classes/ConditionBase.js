import Records from "./Records";

export default class ConditionBase {

  _attributeId;
  _ancestors = new Map();
  #annotation; // <Attribute>
  #catexxxgoryId;
  #dataset;

  constructor(attributeId) {
    this._attributeId = attributeId;
  }

  /**
   * 
   * @param {string} node 
   * @param {string} ancestors 
   */
  setAncestors(node, ancestors) {
    if (!node || !ancestors) return;
    this._ancestors.set(node, [...ancestors]);
  }

  getAncestors(node) {
    let ancestors = this._ancestors.get(node);
    if (!ancestors) {
      ancestors = Records.getAncestors(this._attributeId, node).map(ancestor => ancestor.node);
      this.setAncestors(node, ancestors);
    }
    return ancestors;
  }


  // accessor

  get attributeId() {
    return this._attributeId;
  }

  get annotation() {
    if (!this.#annotation) this.#annotation = Records.getAttribute(this._attributeId);
    return this.#annotation;
  }

  get catexxxgoryId() {
    if (!this.#catexxxgoryId) {
      this.#catexxxgoryId = Records.getCatexxxgoryWithAttributeId(this.annotation.id).id;
    }
    return this.#catexxxgoryId;
  }

  get dataset() {
    if (!this.#dataset) {
      this.#dataset = this.annotation.dataset;
    }
    return this.#dataset;
  }

}