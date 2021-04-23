import DefaultEventEmitter from "./DefaultEventEmitter";

class ConditionBuilder {

  #propertyConditions;
  #attributeConditions;
  #subjectId;
  #togoKey;

  constructor() {
    this.#propertyConditions = [];
    this.#attributeConditions = [];
  }

  // public methods

  addProperty(condition) {
    console.log('addProperty', condition)
    // store
    this.#propertyConditions.push(condition);
    // evaluate
    this.#satisfyAggregation();
    // dispatch event
    const event = new CustomEvent('mutatePropertyCondition', {detail: {
      action: 'add', 
      condition
    }});
    DefaultEventEmitter.dispatchEvent(event);
  }

  addPropertyValue(condition) {
    console.log('add condition', condition)
    // store
    this.#attributeConditions.push(condition);
    // evaluate
    this.#satisfyAggregation();
    // dispatch event
    const event = new CustomEvent('mutatePropertyValueCondition', {detail: {
      action: 'add', 
      condition
    }});
    DefaultEventEmitter.dispatchEvent(event);
  }

  removeProperty(propertyId) {
    // remove from store
    const position = this.#propertyConditions.findIndex(condition => condition.property.propertyId === propertyId);
    if (position === -1) return;
    this.#propertyConditions.splice(position, 1)[0];
    // evaluate
    this.#satisfyAggregation();
    // dispatch event
    const event = new CustomEvent('mutatePropertyCondition', {detail: {action: 'remove', propertyId}});
    DefaultEventEmitter.dispatchEvent(event);
  }

  removePropertyValue(propertyId, categoryId, range) {
    // remove from store
    const position = this.#attributeConditions.findIndex(condition => condition.property.propertyId === propertyId && condition.value.categoryId === categoryId);
    if (position === -1) return;
    this.#attributeConditions.splice(position, 1)[0];
    // evaluate
    this.#satisfyAggregation();
    // dispatch event
    const event = new CustomEvent('mutatePropertyValueCondition', {detail: {action: 'remove', propertyId, categoryId}});
    DefaultEventEmitter.dispatchEvent(event);
  }

  makeQueryParameter() {
    // create properties
    const properties = this.#propertyConditions.map(condition => {
      return {
        query: {
          propertyId: condition.property.propertyId
        },
        property: condition.property,
        subject: condition.subject
      };
    });
    const attributesForEachProperties = {};
    this.#attributeConditions.forEach(condition => {
      const propertyId = condition.property.propertyId;
      if (!attributesForEachProperties[propertyId]) attributesForEachProperties[propertyId] = [];
      attributesForEachProperties[propertyId].push(condition.value.categoryId);
    });
    // create attributes (property values)
    const attributes = Object.keys(attributesForEachProperties).map(propertyId => {
      return {
        query: {
          propertyId,
          categoryIds: attributesForEachProperties[propertyId]
        },
        property: this.#attributeConditions.find(condition => condition.property.propertyId === propertyId).property,
        subject: this.#attributeConditions.find(condition => condition.property.propertyId === propertyId).subject
      };
    });
    // emmit event
    const event = new CustomEvent('completeQueryParameter', {detail: {
      togoKey: this.#togoKey,
      subjectId: this.#subjectId,
      properties,
      attributes
    }});
    DefaultEventEmitter.dispatchEvent(event);

    // clear condition
    // this.#propertyConditions = [];
    // this.#attributeConditions = [];
  }

  setSubject(togoKey, subjectId) {
    this.#togoKey = togoKey;
    this.#subjectId = subjectId;
    this.#satisfyAggregation();
  }

  // public accessor

  get currentTogoKey() {
    return this.#togoKey;
  }

  // private methods

  #satisfyAggregation() {
    const established 
      = (this.#togoKey && this.#subjectId)
      && (this.#propertyConditions.length > 0 || this.#attributeConditions.length > 0);
    const event = new CustomEvent('mutateEstablishConditions', {detail: established});
    DefaultEventEmitter.dispatchEvent(event);
  }

}

export default new ConditionBuilder();
