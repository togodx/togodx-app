import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import * as event from '../events';

class ConditionBuilder {

  #propertyConditions;
  #attributeConditions;
  #subjectId;
  #togoKey;
  #userIds;
  #isRestoredConditinoFromURLParameters = false;
  #preparingCounter;

  constructor() {

    this.#propertyConditions = [];
    this.#attributeConditions = [];
    this.#preparingCounter = 0;
    this.#isRestoredConditinoFromURLParameters = false;

    // event listeners
    window.addEventListener('popstate', this.#createSearchConditionFromURLParameters.bind(this));
    DefaultEventEmitter.addEventListener(event.clearCondition, this.#clearConditinos.bind(this));

  }

  // public methods

  init() {
    this.#createSearchConditionFromURLParameters(true);
  }

  setSubject(togoKey, subjectId) {
    console.log('setSubject', togoKey, subjectId)
    this.#togoKey = togoKey;
    this.#subjectId = subjectId;
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  setUserIds(ids) {
    console.log('setUserIds', ids)
    this.#userIds = ids;
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  addProperty(propertyId, parentCategoryId, isFinal = true) {
    // console.log('addProperty', propertyId, parentCategoryId, isFinal)
    // store
    this.#propertyConditions.push({propertyId, parentCategoryId});
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyCondition, {detail: {action: 'add', propertyId, parentCategoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  addPropertyValue(propertyId, categoryId, isFinal = true) {
    // console.log('addPropertyValue', propertyId, categoryId, isFinal)
    // find value of same property
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
    // console.log('removeProperty', propertyId, parentCategoryId, isFinal)
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
    // console.log('removePropertyValue', propertyId, categoryId, isFinal)
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
    // console.log('setProperties', conditions, isFinal)
    // delete existing properties
    while (this.#propertyConditions.length > 0) {
      this.removeProperty(this.#propertyConditions[0].propertyId, this.#propertyConditions[0].parentCategoryId, false);
    };
    // set new properties
    conditions.forEach(({propertyId, parentCategoryId}) => this.addProperty(propertyId, parentCategoryId, false));
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
  }

  setPropertyValues(propertyId, categoryIds, isFinal = true) {
    // console.log('setPropertyValues', propertyId, categoryIds, isFinal)
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

  finish(dontLeaveInHistory) {
    console.log('finish', dontLeaveInHistory)
    this.#postProcessing(dontLeaveInHistory);
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

  isSelectedProperty(propertyId) {
    const condiiton = this.#propertyConditions.find(condiiton => condiiton.propertyId === propertyId);
    if (condiiton && condiiton.parentCategoryId === undefined) {
      return true;
    } else {
      return false;
    }
  }

  getSelectedParentCategoryId(propertyId) {
    const condition = this.#propertyConditions.find(condition => condition.propertyId === propertyId);
    return condition?.parentCategoryId;
  }

  getSelectedCategoryIds(propertyId) {
    const categoryIds = [];
    const condition = this.#attributeConditions.find(condition => condition.propertyId === propertyId);
    if (condition) categoryIds.push(...condition.categoryIds);
    return categoryIds;
  }


  // public accessor

  get currentTogoKey() {
    return this.#togoKey;
  }

  get userIds() {
    return this.#userIds === '' ? undefined : this.#userIds;
  }


  // private methods

  #postProcessing(dontLeaveInHistory = true) {
    console.log(this.#propertyConditions, this.#attributeConditions, dontLeaveInHistory)

    if (!this.#isRestoredConditinoFromURLParameters) return;

    // evaluate if search is possible
    const established 
      = (this.#togoKey && this.#subjectId)
      && (this.#propertyConditions.length > 0 || this.#attributeConditions.length > 0);
    const customEvent = new CustomEvent(event.mutateEstablishConditions, {detail: established});
    DefaultEventEmitter.dispatchEvent(customEvent);

    // get hierarchic conditions
    const [keys, values] = this.#getHierarchicConditions();
    console.log(keys, values)

    // generate permalink
    const params = new URL(location).searchParams;
    params.set('togoKey', this.#togoKey);
    params.set('userIds', this.userIds ? this.userIds : '');
    params.set('keys', encodeURIComponent(JSON.stringify(keys)));
    params.set('values', encodeURIComponent(JSON.stringify(values)));
    if (dontLeaveInHistory) window.history.pushState(null, '', `${window.location.origin}${window.location.pathname}?${params.toString()}`)

  }

  #createSearchConditionFromURLParameters(isFirst = false) {

    // get conditions with ancestors
    const params = new URL(location).searchParams;
    const condition = {
      togoKey: params.get('togoKey'),
      userIds: params.get('userIds'),
      keys: JSON.parse(decodeURIComponent(params.get('keys'))) ?? [],
      values: JSON.parse(decodeURIComponent(params.get('values'))) ?? []
    }

    if (isFirst) {
      // get child category ids
      this.#makeQueueOfGettingChildCategoryIds(condition);
    } else {
      this.#restoreConditions(condition);
    }

  }

  #makeQueueOfGettingChildCategoryIds(condition) {
    const queue = [];
    condition.keys.forEach(({propertyId, id}) => {
      if (id) {
        id.ancestors.forEach(categoryId => {
          queue.push({propertyId, categoryId});
        })
      }
    });
    condition.values.forEach(({propertyId, ids}) => {
      ids.forEach(id => {
        if (id.ancestors) {
          id.ancestors.forEach(categoryId => {
            queue.push({propertyId, categoryId});
          });
        }
      })
    });
    this.#progressQueueOfGettingChildCategoryIds(condition, queue);
  }

  #progressQueueOfGettingChildCategoryIds(condition, queue) {
    if (queue.length > 0) {
      const {propertyId, categoryId} = queue.shift();
      this.#getChildCategoryIds(propertyId, categoryId)
        .then(() => this.#progressQueueOfGettingChildCategoryIds(condition, queue));
    } else {
      this.#restoreConditions(condition);
    }
  }

  #getChildCategoryIds(propertyId, categoryId) {
    return new Promise((resolve, reject) => {
      Records.fetchPropertyValues(propertyId, categoryId)
        .then(values => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  #restoreConditions({togoKey, userIds, keys, values}) {
    console.log(togoKey, userIds, keys, values)

    this.#isRestoredConditinoFromURLParameters = true;

    // restore conditions
    this.#togoKey = togoKey;
    const [properties, attributes] = this.#getCondtionsFromHierarchicConditions(keys, values);
    console.log(properties, attributes)
    this.setProperties(properties, false);
    Records.properties.forEach(({propertyId}) => {
      const property = attributes.find(property => property.propertyId === propertyId);
      const categoryIds = [];
      if (property) categoryIds.push(...property.categoryIds);
      this.setPropertyValues(propertyId, categoryIds, false);
    });
    this.finish(false);

    // dispatch event
    const customEvent = new CustomEvent(event.restoreParameters, {detail: {togoKey, userIds, keys, values}});
    DefaultEventEmitter.dispatchEvent(customEvent);

  }

  #clearConditinos() {
    while (this.#propertyConditions.length > 0) {
      const {propertyId, parentCategoryId} = this.#propertyConditions[0];
      this.removeProperty(propertyId, parentCategoryId, false);
    };
    while (this.#attributeConditions.length > 0) {
      const {propertyId, categoryIds} = this.#attributeConditions[0];
      while (categoryIds.length > 0) {
        this.removePropertyValue(propertyId, categoryIds[0], false);
      }
    };
    this.#postProcessing();
  }

  #getHierarchicConditions() {
    const keys = [];
    this.#propertyConditions.forEach(({propertyId, parentCategoryId}) => {
      const property = {propertyId};
      if (parentCategoryId) {
        property.id = {
          categoryId: parentCategoryId,
          ancestors: Records.getAncestors(propertyId, parentCategoryId).map(ancestor => ancestor.categoryId)
        }
      }
      keys.push(property);
    });
    const values = [];
    this.#attributeConditions.forEach(({propertyId, categoryIds}) => {
      const ids = [];
      categoryIds.forEach(categoryId => {
        const id = {categoryId};
        const ancestors = Records.getAncestors(propertyId, categoryId).map(ancestor => ancestor.categoryId);
        if (ancestors.length > 0) id.ancestors = ancestors;
        ids.push(id);
      })
      values.push({propertyId, ids});
    });
    return [keys, values];
  }

  #getCondtionsFromHierarchicConditions(keys, values) {
    // restore conditions
    const properties = keys.map(({propertyId, id}) => {
      return {
        propertyId,
        parentCategoryId: id?.categoryId
      }
    });
    const attributes = values.map(({propertyId, ids}) => {
      return {
        propertyId,
        categoryIds: ids.map(id => id.categoryId)
      }
    });
    return [properties, attributes];
  }

}

export default new ConditionBuilder();
