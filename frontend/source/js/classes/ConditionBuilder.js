import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import * as event from '../events';

class ConditionBuilder {

  #propertyConditions;
  #attributeConditions;
  #subjectId;
  #togoKey;
  #userIds;

  constructor() {
    this.#propertyConditions = [];
    this.#attributeConditions = [];
  }

  // public methods

  setSubject(togoKey, subjectId) {
    this.#togoKey = togoKey;
    this.#subjectId = subjectId;
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  setUserIds(ids) {
    console.log(ids)
    this.#userIds = ids;
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  addProperty(condition) {
    console.log('addProperty', condition)
    // store
    this.#propertyConditions.push(condition);
    // evaluate
    this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyCondition, {detail: {
      action: 'add', 
      condition
    }});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  addPropertyValue(condition) {
    console.log('add condition', condition)
    // store
    this.#attributeConditions.push(condition);
    // evaluate
    this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyValueCondition, {detail: {
      action: 'add', 
      condition
    }});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removeProperty(propertyId, parentCategoryId) {
    console.log('removeProperty', propertyId, parentCategoryId)
    // remove from store
    const index = this.#propertyConditions.findIndex(condition => {
      // condition.property.propertyId === propertyIds;
      if (condition.property.propertyId === propertyId) {
        if (parentCategoryId) {
          return parentCategoryId === condition.subCategory?.parentCategoryId;
        } else {
          return true;
        }
      }
    });
    if (index === -1) return;
    this.#propertyConditions.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyCondition, {detail: {action: 'remove', propertyId, parentCategoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removePropertyValue(propertyId, categoryId) {
    // remove from store
    const index = this.#attributeConditions.findIndex(condition => condition.property.propertyId === propertyId && condition.value.categoryId === categoryId);
    if (index === -1) return;
    this.#attributeConditions.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyValueCondition, {detail: {action: 'remove', propertyId, categoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  setProperties(conditions) {
    const propertyIds = conditions.map(condition => condition.property.propertyId);
    Records.properties.forEach(property => {
      const isExistInNewConditions = propertyIds.indexOf(property.propertyId) !== -1;
      const index = this.#propertyConditions.findIndex(condition => condition.property.propertyId === property.propertyId);
      if (isExistInNewConditions) {
        if (index === -1) {
          // if the property exists in new conditions, and if the property doesn't exist in my conditions, add it
          this.addProperty(conditions.find(condition => condition.property.propertyId === property.propertyId));
        }
      } else {
        if (index !== -1) {
          // if the property doesn't exist in new conditions, and the proerty exists in my conditions, remove it
          this.removeProperty(property.propertyId);
        }
      }
    });
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  setPropertyValues(condition) {
    const originalValues = Records.getProperty(condition.property.propertyId).values;
    const startIndex = condition.values.length === 0 ? 0 : originalValues.findIndex(originalValue => originalValue.categoryId === condition.values[0].categoryId);
    originalValues.forEach((originalValue, originalIndex) => {
      const index = this.#attributeConditions.findIndex(attrCondition => attrCondition.property.propertyId === condition.property.propertyId && attrCondition.value.categoryId === originalValue.categoryId);
      if (startIndex <= originalIndex && originalIndex < startIndex + condition.values.length) {
        const value = condition.values[originalIndex - startIndex];
        // add
        if (index === -1) {
          this.addPropertyValue({
            subject: condition.subject,
            property: condition.property,
            value 
          });
        }
      } else {
        // remove
        if (index !== -1) {
          this.removePropertyValue(condition.property.propertyId, originalValue.categoryId);
        }
      }
    });
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  makeQueryParameter() {
    // create properties
    const properties = this.#propertyConditions.map(condition => {
      const query = {propertyId: condition.property.propertyId};
      if (condition.subCategory) query.categoryIds = condition.subCategory.values;
      return {
        query,
        property: condition.property,
        subject: condition.subject,
        subCategory: condition.subCategory
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
    const customEvent = new CustomEvent(event.completeQueryParameter, {detail: {
      togoKey: this.#togoKey,
      subjectId: this.#subjectId,
      properties,
      attributes
    }});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }


  // public accessor

  get currentTogoKey() {
    return this.#togoKey;
  }

  get userIds() {
    return this.#userIds === '' ? undefined : this.#userIds;
  }


  // private methods

  #postProcessing() {

    // evaluate if search is possible
    const established 
      = (this.#togoKey && this.#subjectId)
      && (this.#propertyConditions.length > 0 || this.#attributeConditions.length > 0);
    const customEvent = new CustomEvent(event.mutateEstablishConditions, {detail: established});
    DefaultEventEmitter.dispatchEvent(customEvent);

    // generate permalink
  }

}

export default new ConditionBuilder();
