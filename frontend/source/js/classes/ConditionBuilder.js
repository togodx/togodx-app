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

  addProperty(propertyId, parentCategoryId, isFinal = true) {
    console.log('addProperty', propertyId, parentCategoryId)
    // store
    this.#propertyConditions.push({propertyId, parentCategoryId});
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyCondition, {detail: {action: 'add', propertyId, parentCategoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  addPropertyValue(propertyId, categoryId, isFinal = true) {
    console.log('addPropertyValue', propertyId, categoryId)
    // find value of same property
    console.log(this.#attributeConditions)
    const samePropertyCondition = this.#attributeConditions.find(condition => condition.propertyId === propertyId);
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
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyValueCondition, {detail: {action: 'add', propertyId, categoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removeProperty(propertyId, parentCategoryId, isFinal = true) {
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
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyCondition, {detail: {action: 'remove', propertyId, parentCategoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removePropertyValue(propertyId, categoryId, isFinal = true) {
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
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyValueCondition, {detail: {action: 'remove', propertyId, categoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  setProperties(conditions, isFinal = true) {
    // delete existing properties
    while (this.#propertyConditions.length > 0) {
      this.removeProperty(this.#propertyConditions[0].propertyId, this.#propertyConditions[0].parentCategoryId);
    };
    // set new properties
    conditions.forEach(({propertyId, parentCategoryId}) => this.addProperty(propertyId, parentCategoryId, false));
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
  }

  setPropertyValues(propertyId, categoryIds, isFinal = true) {
    const oldCondition = this.#attributeConditions.find(condition => condition.propertyId === propertyId);
    if (oldCondition) {
      const originalValues = Records.getProperty(propertyId).values;
      originalValues.forEach(originalValue => {
        const indexInNew = categoryIds.indexOf(originalValue.categoryId);
        const indexInOld = oldCondition.categoryIds.indexOf(originalValue.categoryId);
        if (indexInNew !== -1) {
          // if new value does not exist in old values, add property value
          if (indexInOld === -1) this.addPropertyValue(propertyId, originalValue.categoryId, false);
        } else {
          // if extra value exists in old values, remove property value
          if (indexInOld !== -1) this.removePropertyValue(propertyId, originalValue.categoryId, false);
        }
      });
    } else {
      for (const categoryId of categoryIds) {
        this.addPropertyValue(propertyId, categoryId, false);
      }
    }
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
  }

  finish() {
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
        query: {
          propertyId, 
          categoryIds: [].concat(categoryIds)
        },
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
    const params = new URL(location).searchParams;
    params.set('togoKey', this.#togoKey);
    params.set('userIds', this.userIds ? this.userIds : '');
    params.set('keys', encodeURIComponent(JSON.stringify(this.#propertyConditions)));
    params.set('values', encodeURIComponent(JSON.stringify(this.#attributeConditions)));
    console.log(params.toString());
    for (const entry of params.entries()) {
      console.log(entry);
    }
    window.history.pushState('', '', `${window.location.origin}${window.location.pathname}?${params.toString()}`)

  }

}

export default new ConditionBuilder();
