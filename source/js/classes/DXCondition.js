import ConditionAnnotation from "./ConditionAnnotation";
import ConditionFilter from "./ConditionFilter";

export default class DXCondition {

  #togoKey;
  #conditionAnnotations;
  #conditionFilters;

  constructor(togoKey, conditionAnnotations, conditionFilters) {
    this.#togoKey = togoKey;
    this.#conditionAnnotations = this.#copyConditionAnnotations(conditionAnnotations);
    this.#conditionFilters = this.#copyConditionFilters(conditionFilters);
  }


  // methods

  /**
   * 
   * @param {DXCondition} dxCondition 
   * @return Boolean
   */
  checkSameCondition(dxCondition) {
    // annotations
    let matchAnnotations = false;
    if (this.conditionAnnotations.length === dxCondition.conditionAnnotations.length) {
      matchAnnotations = this.conditionAnnotations.every(conditionAnnotation => {
        return dxCondition.conditionAnnotations.findIndex(newConditionAnnotation => {
          return (
            conditionAnnotation.attributeId === newConditionAnnotation.attributeId &&
            conditionAnnotation.parentNode === newConditionAnnotation.parentNode
          );
        }) !== -1;
      });
    }
    // values
    let matchFilters = false;
    if (this.conditionFilters.length === dxCondition.conditionFilters.length) {
      matchFilters = this.conditionFilters.every(conditionFilter => {
        return dxCondition.conditionFilters.findIndex(newConditionFilter => {
          return (
            conditionFilter.attributeId === newConditionFilter.attributeId &&
            (
              conditionFilter.nodes.length === newConditionFilter.nodes.length &&
              conditionFilter.nodes.every(node => {
                return newConditionFilter.nodes.findIndex(newCategoryId => node === newCategoryId) !== -1;
              })
            )
          );
        }) !== -1;
      });
    }
    return dxCondition.togoKey === this.togoKey && matchAnnotations && matchFilters;
  }

  #copyConditionAnnotations(conditionAnnotations) {
    return conditionAnnotations.map(conditionAnnotation => new ConditionAnnotation(conditionAnnotation.attributeId, conditionAnnotation.parentNode));
  }

  #copyConditionFilters(conditionFilters) {
    return conditionFilters.map(conditionFilter => new ConditionFilter(conditionFilter.attributeId, [...conditionFilter.nodes]));
  }


  // accessor

  get togoKey() {
    return this.#togoKey;
  }

  get conditionAnnotations() {
    return this.#conditionAnnotations;
  }

  get conditionFilters() {
    return this.#conditionFilters;
  }

  get queryFilters() {
    return this.#conditionFilters.map(conditionFilters => conditionFilters.query);
  }

  get queryAnnotations() {
    return this.#conditionAnnotations.map(conditionAnnotations => conditionAnnotations.query);
  }

}