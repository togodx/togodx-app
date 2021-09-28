import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import KeyCondition from "./KeyCondition";
import ValuesCondition from "./ValuesCondition";
import DXCondition from "./DXCondition";
import * as event from '../events';

class ConditionBuilder {

  #keyConditions; // Array<KeyCondition>
  #valuesConditions; // Array<ValuesCondition>
  #togoKey;
  #userIds;
  #isRestoredConditinoFromURLParameters = false;
  #preparingCounter;

  constructor() {

    this.#keyConditions = [];
    this.#valuesConditions = [];
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

  setSubject(togoKey) {
    this.#togoKey = togoKey;
    this.#postProcessing();
  }

  setUserIds(ids = '') {
    this.#userIds = ids.replace(/,/g," ").split(/\s+/).join(',');
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  addProperty(propertyId, parentCategoryId, isFinal = true) {
    // store
    const keyCondiiton = new KeyCondition(propertyId, parentCategoryId);
    this.#keyConditions.push(keyCondiiton);
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyCondition, {detail: {action: 'add', propertyId, parentCategoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  addPropertyValue(propertyId, categoryId, ancestors = [], isFinal = true) {
    // find value of same property
    const sameValuesCondition = this.#valuesConditions.find(valuesCondition => valuesCondition.propertyId === propertyId);
    // store
    if (sameValuesCondition) {
      sameValuesCondition.addCategoryId(categoryId);
    } else {
      const valuesCondition = new ValuesCondition(propertyId, [categoryId]);
      this.#valuesConditions.push(valuesCondition);
    }
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyValueCondition, {detail: {action: 'add', propertyId, categoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removeProperty(propertyId, parentCategoryId, isFinal = true) {
    // remove from store
    const index = this.#keyConditions.findIndex(keyCondition => keyCondition.isSameCondition(propertyId, parentCategoryId));
    if (index === -1) return;
    this.#keyConditions.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyCondition, {detail: {action: 'remove', propertyId, parentCategoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removePropertyValue(propertyId, categoryId, isFinal = true) {
    // remove from store
    const index = this.#valuesConditions.findIndex(valuesCondition => {
      if (valuesCondition.propertyId === propertyId) {
        valuesCondition.removeCategoryId(categoryId);
        return valuesCondition.categoryIds.length === 0;
      } else {
        return false;
      }
    });
    if (index !== -1) this.#valuesConditions.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutatePropertyValueCondition, {detail: {action: 'remove', propertyId, categoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  setProperties(conditions, isFinal = true) {
    // delete existing properties
    while (this.#keyConditions.length > 0) {
      this.removeProperty(this.#keyConditions[0].propertyId, this.#keyConditions[0].parentCategoryId, false);
    };
    // set new properties
    conditions.forEach(({propertyId, parentCategoryId}) => this.addProperty(propertyId, parentCategoryId, false));
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
  }

  setPropertyValues(propertyId, categoryIds, isFinal = true) {
    // console.log(propertyId, categoryIds, isFinal)
    const oldValuesCondition = this.#valuesConditions.find(valuesCondition => valuesCondition.propertyId === propertyId);
    if (oldValuesCondition) {
      const originalValues = Records.getProperty(propertyId).values;
      originalValues.forEach(originalValue => {
        const indexInNew = categoryIds.indexOf(originalValue.categoryId);
        const indexInOld = oldValuesCondition.categoryIds.indexOf(originalValue.categoryId);
        if (indexInNew !== -1) {
          // if new value does not exist in old values, add property value
          if (indexInOld === -1) this.addPropertyValue(propertyId, originalValue.categoryId, [], false);
        } else {
          // if extra value exists in old values, remove property value
          if (indexInOld !== -1) this.removePropertyValue(propertyId, originalValue.categoryId, false);
        }
      });
    } else {
      for (const categoryId of categoryIds) {
        this.addPropertyValue(propertyId, categoryId, [], false);
      }
    }
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
  }

  finish(dontLeaveInHistory) {
    this.#postProcessing(dontLeaveInHistory);
  }

  makeQueryParameter() {
    // emmit event
    const customEvent = new CustomEvent(event.completeQueryParameter, {detail: new DXCondition(
      this.#togoKey,
      this.#keyConditions,
      this.#valuesConditions
    )});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  isSelectedProperty(propertyId) {
    const keyCondiiton = this.#keyConditions.find(keyCondiiton => keyCondiiton.propertyId === propertyId);
    if (keyCondiiton && keyCondiiton.parentCategoryId === undefined) {
      return true;
    } else {
      return false;
    }
  }

  getSelectedParentCategoryId(propertyId) {
    const keyCondition = this.#keyConditions.find(keyCondition => keyCondition.propertyId === propertyId);
    return keyCondition?.parentCategoryId;
  }

  getSelectedCategoryIds(propertyId) {
    const categoryIds = [];
    const valuesCondition = this.#valuesConditions.find(valuesCondition => valuesCondition.propertyId === propertyId);
    if (valuesCondition) categoryIds.push(...valuesCondition.categoryIds);
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

    if (!this.#isRestoredConditinoFromURLParameters) return;

    // evaluate if search is possible
    const established 
      = this.#togoKey
      && (this.#keyConditions.length > 0 || this.#valuesConditions.length > 0);
    const customEvent = new CustomEvent(event.mutateEstablishConditions, {detail: established});
    DefaultEventEmitter.dispatchEvent(customEvent);

    // get hierarchic conditions
    const keys = this.#keyConditions.map(keyCondiiton => keyCondiiton.getURLParameter());
    const values = this.#valuesConditions.map(valuesCondition => valuesCondition.getURLParameter());

    // generate permalink
    const params = new URL(location).searchParams;
    params.set('togoKey', this.#togoKey);
    // params.set('userIds', this.userIds ? this.userIds : '');
    params.set('keys', JSON.stringify(keys));
    params.set('values', JSON.stringify(values));
    if (dontLeaveInHistory) window.history.pushState(null, '', `${window.location.origin}${window.location.pathname}?${params.toString()}`)
  }

  #createSearchConditionFromURLParameters(isFirst = false) {

    // get conditions with ancestors
    const params = new URL(location).searchParams;
    const condition = {
      togoKey: params.get('togoKey'),
      // userIds: (params.get('userIds') ?? '').split(',').filter(id => id !== ''),
      keys: JSON.parse(params.get('keys')) ?? [],
      values: JSON.parse(params.get('values')) ?? []
    }

    if (isFirst) {
      // get child category ids
      this.#makeQueueOfGettingChildCategoryIds(condition);
    } else {
      this.#restoreConditions(condition);
    }

  }

  #makeQueueOfGettingChildCategoryIds(condition) {
    console.log(condition)
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
    
    this.#isRestoredConditinoFromURLParameters = true;

    // restore conditions
    this.#togoKey = togoKey;
    // this.#userIds = userIds;
    const [properties, attributes] = this.#getCondtionsFromHierarchicConditions(keys, values);
    this.setProperties(properties, false);
    Records.properties.forEach(({propertyId}) => {
      const property = attributes.find(property => property.propertyId === propertyId);
      const categoryIds = [];
      if (property) categoryIds.push(...property.categoryIds);
      this.setPropertyValues(propertyId, categoryIds, false);
    });
    this.finish(false);

    // dispatch event
    const customEvent = new CustomEvent(event.restoreParameters, {detail: {togoKey, keys, values}});
    DefaultEventEmitter.dispatchEvent(customEvent);

  }

  #clearConditinos() {
    while (this.#keyConditions.length > 0) {
      const {propertyId, parentCategoryId} = this.#keyConditions[0];
      this.removeProperty(propertyId, parentCategoryId, false);
    };
    while (this.#valuesConditions.length > 0) {
      const {propertyId, categoryIds} = this.#valuesConditions[0];
      while (categoryIds.length > 0) {
        this.removePropertyValue(propertyId, categoryIds[0], false);
      }
    };
    this.#postProcessing();
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
