import ConditionBase from "./ConditionBase";
import Records from "./Records";

export default class ConditionFilter extends ConditionBase {

  #nodes;

  constructor(attributeId, nodes) {
    super(attributeId);
    this.#nodes = nodes;
  }


  // methods

  addCategoryId(node) {
    this.#nodes.push(node);
  }

  removeCategoryId(node) {
    const index = this.#nodes.indexOf(node);
    this.#nodes.splice(index, 1);
  }

  getURLParameter() {
    const values = {
      attributeId: this._attributeId,
      ids: []
    }
    this.#nodes.forEach(node => {
      const id = {node};
      const ancestors = Records.getAncestors(this._attributeId, node).map(ancestor => ancestor.node);
      if (ancestors.length > 0) id.ancestors = ancestors;
      values.ids.push(id);
    })
    return values;
}


  // accessor

  get nodes() {
    return this.#nodes;
  }

  get label() {
    return this.annotation.label;
  }

  get query() {
    return {
      attribute: this._attributeId,
      nodes: this.nodes
    }
  }

}
