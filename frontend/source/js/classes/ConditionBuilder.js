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

  addProperty(propertyId, parentCategoryId) {
    console.log('addProperty', propertyId, parentCategoryId)
    // store
    this.#propertyConditions.push({propertyId, parentCategoryId});
    // evaluate
    this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyCondition, {detail: {
      action: 'add', 
      propertyId,
      parentCategoryId
    }});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  addPropertyValue(propertyId, categoryId) {
    console.log('addPropertyValue', propertyId, categoryId)
    // find value of same property
    const samePropertyCondition = this.#attributeConditions.find(({propertyId}) => propertyId === propertyId);
    // store
    if (samePropertyCondition) {
      samePropertyCondition.categoryIds.push(categoryId);
    } else {
      this.#attributeConditions.push({
        propertyId,
        categoryIds: [categoryId]
      });
    }
    // evaluate
    this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyValueCondition, {detail: {
      action: 'add', 
      condition: {propertyId, categoryId}
    }});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removeProperty(propertyId, parentCategoryId) {
    console.log('removeProperty', propertyId, parentCategoryId)
    // remove from store
    const index = this.#propertyConditions.findIndex(condition => {
      if (propertyId === condition.propertyId) {
        if (parentCategoryId) {
          return parentCategoryId === condition.parentCategoryId;
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
    console.log('removePropertyValue', propertyId, categoryId)
    // remove from store
    const index = this.#attributeConditions.findIndex(condition => {
      if (condition.propertyId === propertyId) {
        const index = condition.categoryIds.indexOf(categoryId);
        condition.categoryIds.splice(index, 1);
        return condition.categoryIds.length === 0;
      } else {
        return false;
      }
    });
    if (index !== -1) this.#attributeConditions.splice(index, 1)[0];
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

  setPropertyValues(propertyId, categoryIds) {
    const oldCondition = this.#attributeConditions.find(condition => condition.propertyId === propertyId);
    if (oldCondition) {
      const originalValues = Records.getProperty(propertyId).values;
      originalValues.forEach(originalValue => {
        const indexInNew = categoryIds.indexOf(originalValue.categoryId);
        const indexInOld = oldCondition.categoryIds.indexOf(originalValue.categoryId);
        if (indexInNew !== -1) {
          // if new value does not exist in old values, add property value
          if (indexInOld === -1) this.addPropertyValue(propertyId, originalValue.categoryId);
        } else {
          // if extra value exists in old values, remove property value
          if (indexInOld !== -1) this.removePropertyValue(propertyId, originalValue.categoryId);
        }
      });
    } else {
      for (const categoryId of categoryIds) {
        this.addPropertyValue(propertyId, categoryId);
      }
    }
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  makeQueryParameter() {
    console.log(this.#propertyConditions, this.#attributeConditions)
    // TODO: table Data に渡すデータも最適化したいが、現在なかなか合流されない他のブランチで編集中のため、見送り
    // create properties
    const properties = this.#propertyConditions.map(({propertyId, parentCategoryId}) => {
      const subject = Records.getSubjectWithPropertyId(propertyId);
      const property = Records.getProperty(propertyId);
      const query = {propertyId};
      if (parentCategoryId) {
        query.categoryIds = Records.getValuesWithParentCategoryId(propertyId, parentCategoryId).map(value => value.categoryId);
      };
      return {query, subject, property, parentCategoryId};
    });
    // create attributes (property values)
    const attributes = this.#attributeConditions.map(({propertyId, categoryIds}) => {
      const subject = Records.getSubjectWithPropertyId(propertyId);
      const property = Records.getProperty(propertyId);
      return {
        query: {propertyId, categoryIds},
        subject,
        property
      }
    })
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
