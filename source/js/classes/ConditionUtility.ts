import Records from "./Records.ts";
import AttributeUtility from "./AttributeUtility.ts";

export default class ConditionUtility {

  protected _attributeId: string;
  protected _ancestors: Map<string, string[]> = new Map();
  #annotation: AttributeUtility | undefined;
  #categoryId: string | undefined;
  #dataset: string | undefined;

  constructor(attributeId: string) {
    this._attributeId = attributeId;
  }

  /**
   * 
   * @param {string} node 
   * @param {string} ancestors 
   */
  setAncestors(node: string, ancestors: string[]): void {
    if (!node || !ancestors) return;
    this._ancestors.set(node, [...ancestors]);
  }

  getAncestors(node: string): string[] {
    console.log(node)
    let ancestors = this._ancestors.get(node);
    if (!ancestors) {
      ancestors = Records.getAncestors(this._attributeId, node).map(ancestor => ancestor.node);
      this.setAncestors(node, ancestors);
    }
    return ancestors;
  }


  // accessor

  get attributeId(): string {
    return this._attributeId;
  }

  get attribute(): AttributeUtility {
    if (!this.#annotation) this.#annotation = Records.getAttribute(this._attributeId);
    return this.#annotation;
  }

  get categoryId(): string {
    if (!this.#categoryId) {
      this.#categoryId = Records.getCategoryWithAttributeId(this.attribute.id)!.id;
    }
    return this.#categoryId;
  }

  get dataset(): string {
    if (!this.#dataset) {
      this.#dataset = this.attribute.dataset;
    }
    return this.#dataset;
  }

}