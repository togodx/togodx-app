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
    // find value of same property
    const samePropertyCondition = this.#attributeConditions.find(({property}) => property.propertyId === condition.property.propertyId);
    console.log(samePropertyCondition)
    // store
    if (samePropertyCondition) {
      samePropertyCondition.values.push(condition.value);
    } else {
      this.#attributeConditions.push({
        subject: condition.subject,
        property: condition.property,
        values: [condition.value]
      });
    }
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
    const index = this.#propertyConditions.findIndex(({property, subCategory}) => {
      if (property.propertyId === propertyId) {
        if (parentCategoryId) {
          return parentCategoryId === subCategory?.parentCategoryId;
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
    const index = this.#attributeConditions.findIndex(({property, value}) => property.propertyId === propertyId && value.categoryId === categoryId);
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

  setPropertyValues({subject, property, values}) {
    const originalValues = Records.getProperty(property.propertyId).values;
    const startIndex = values.length === 0 ? 0 : originalValues.findIndex(originalValue => originalValue.categoryId === values[0].categoryId);
    originalValues.forEach((originalValue, originalIndex) => {
      const index = this.#attributeConditions.findIndex(attrCondition => attrCondition.property.propertyId === property.propertyId && attrCondition.value.categoryId === originalValue.categoryId);
      if (startIndex <= originalIndex && originalIndex < startIndex + values.length) {
        const value = values[originalIndex - startIndex];
        // add
        if (index === -1) {
          this.addPropertyValue({subject, property, value});
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
    const properties = this.#propertyConditions.map(({subject, property, subCategory}) => {
      const query = {propertyId: property.propertyId};
      if (subCategory) query.categoryIds = subCategory.values;
      return {query, subject, property, subCategory};
    });
    const attributesForEachProperties = {};
    this.#attributeConditions.forEach(({property, value}) => {
      const propertyId = property.propertyId;
      if (!attributesForEachProperties[propertyId]) attributesForEachProperties[propertyId] = [];
      attributesForEachProperties[propertyId].push(value.categoryId);
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
    console.log(properties, attributes)
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
    console.log(this.currentTogoKey, this.userIds, this.#propertyConditions, this.#attributeConditions)
    // console.log(`togoKey=${this.currentTogoKey}&userIds=${this.userIds ? this.userIds.join(',') : ''}&keys=${JSON.stringify(this.#propertyConditions.map(({property}) => {
    //   return {
    //     propertyId: property.propertyId
    //   }
    // }))}&values=${this.#attributeConditions.map(({property, value}) => {
    //   return {
    //     propertyId: property.propertyId,
    //     categoryIds: property
    //   }
    // })}`)
  }

}

export default new ConditionBuilder();
