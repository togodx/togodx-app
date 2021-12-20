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

  addAttribute(attributeId, parentCategoryId, isFinal = true) {
    // store
    const keyCondition = new KeyCondition(attributeId, parentCategoryId);
    this.#keyConditions.push(keyCondition);
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeCondition, {detail: {action: 'add', keyCondition}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  addAttributeValue(attributeId, categoryId, ancestors = [], isFinal = true) {
    // console.log(attributeId, categoryId, ancestors)
    // find value of same property
    const sameValuesCondition = this.#valuesConditions.find(valuesCondition => valuesCondition.attributeId === attributeId);
    // store
    if (sameValuesCondition) {
      sameValuesCondition.addCategoryId(categoryId);
    } else {
      const valuesCondition = new ValuesCondition(attributeId, [categoryId]);
      this.#valuesConditions.push(valuesCondition);
    }
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeValueCondition, {detail: {action: 'add', attributeId, categoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removeAttribute(attributeId, parentCategoryId, isFinal = true) {
    // remove from store
    const index = this.#keyConditions.findIndex(keyCondition => keyCondition.isSameCondition(attributeId, parentCategoryId));
    if (index === -1) return;
    const keyCondition = this.#keyConditions.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeCondition, {detail: {action: 'remove', keyCondition}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removeAttributeValue(attributeId, categoryId, isFinal = true) {
    // remove from store
    const index = this.#valuesConditions.findIndex(valuesCondition => {
      if (valuesCondition.attributeId === attributeId) {
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
    const customEvent = new CustomEvent(event.mutateAttributeValueCondition, {detail: {action: 'remove', attributeId, categoryId}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  setAttributes(conditions, isFinal = true) {
    // delete existing properties
    while (this.#keyConditions.length > 0) {
      this.removeAttribute(this.#keyConditions[0].attributeId, this.#keyConditions[0].parentCategoryId, false);
    };
    // set new properties
    conditions.forEach(({attributeId, parentCategoryId}) => this.addAttribute(attributeId, parentCategoryId, false));
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
  }

  setAttributeValues(attributeId, categoryIds, isFinal = true) {
    const oldValuesCondition = this.#valuesConditions.find(valuesCondition => valuesCondition.attributeId === attributeId);
    if (oldValuesCondition) {
      const originalValues = Records.getAttribute(attributeId).values;
      originalValues.forEach(originalValue => {
        const indexInNew = categoryIds.indexOf(originalValue.categoryId);
        const indexInOld = oldValuesCondition.categoryIds.indexOf(originalValue.categoryId);
        if (indexInNew !== -1) {
          // if new value does not exist in old values, add property value
          if (indexInOld === -1) this.addAttributeValue(attributeId, originalValue.categoryId, [], false);
        } else {
          // if extra value exists in old values, remove property value
          if (indexInOld !== -1) this.removeAttributeValue(attributeId, originalValue.categoryId, false);
        }
      });
    } else {
      for (const categoryId of categoryIds) {
        this.addAttributeValue(attributeId, categoryId, [], false);
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

  getSelectedCategoryIds(attributeId) {
    const categoryIds = {
      keys: [],
      values: []
    };
    const keyConditions = this.#keyConditions.filter(keyCondition => keyCondition.attributeId === attributeId);
    const valuesCondition = this.#valuesConditions.find(valuesCondition => valuesCondition.attributeId === attributeId);
    if (keyConditions) categoryIds.keys.push(...keyConditions.map(keyCondiiton => keyCondiiton.parentCategoryId));
    if (valuesCondition) categoryIds.values.push(...valuesCondition.categoryIds);
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
      && (this.#valuesConditions.length > 0);
    const customEvent = new CustomEvent(event.mutateEstablishConditions, {detail: established});
    DefaultEventEmitter.dispatchEvent(customEvent);

    // get hierarchic conditions
    const keys = this.#keyConditions.map(keyCondiiton => keyCondiiton.getURLParameter());
    const values = this.#valuesConditions.map(valuesCondition => valuesCondition.getURLParameter());
    
    // generate permalink
    const params = new URL(location).searchParams;
    params.set('togoKey', this.#togoKey);
    params.set('keys', JSON.stringify(keys));
    params.set('values', JSON.stringify(values));
    if (dontLeaveInHistory) window.history.pushState(null, '', `${window.location.origin}${window.location.pathname}?${params.toString()}`)
  }

  #createSearchConditionFromURLParameters(isFirst = false) {

    // get conditions with ancestors
    const params = new URL(location).searchParams;
    const condition = {
      togoKey: params.get('togoKey'),
      keys: JSON.parse(params.get('keys')) ?? [],
      values: JSON.parse(params.get('values')) ?? []
    }
    // in older versions, 'attributeId' is 'propertyId', so convert them
    condition.keys.forEach(key => {
      if (key.propertyId) {
        key.attributeId = key.propertyId;
        delete key.propertyId;
      }
    });
    condition.values.forEach(key => {
      if (key.propertyId) {
        key.attributeId = key.propertyId;
        delete key.propertyId;
      }
    });
    
    if (isFirst) {
      // get child category ids
      this.#makeQueueOfGettingChildCategoryIds(condition);
    } else {
      this.#restoreConditions(condition);
    }

  }

  #makeQueueOfGettingChildCategoryIds(condition) {
    if (condition.togoKey) this.#togoKey = condition.togoKey;
    const queue = [];
    const addQueue = (attributeId, id) => {
      const ancestors = [id.categoryId];
      if (id.ancestors) ancestors.push(...id.ancestors);
      ancestors.forEach(categoryId => {
        if (queue.findIndex(task => task.attributeId === attributeId && task.categoryId === categoryId) === -1) {
          queue.push({attributeId, categoryId});
        }
      });
    };
    condition.keys.forEach(({attributeId, id}) => {
      if (id) addQueue(attributeId, id);
    });
    condition.values.forEach(({attributeId, ids}) => {
      ids.forEach(id => {
        if (id.ancestors) addQueue(attributeId, id);
      });
    });
    this.#progressQueueOfGettingChildCategoryIds(condition, queue);
  }

  #progressQueueOfGettingChildCategoryIds(condition, queue) {
    if (queue.length > 0) {
      const {attributeId, categoryId} = queue.shift();
      this.#getChildCategoryIds(attributeId, categoryId)
        .then(() => this.#progressQueueOfGettingChildCategoryIds(condition, queue));
    } else {
      this.#restoreConditions(condition);
    }
  }

  #getChildCategoryIds(attributeId, categoryId) {
    return new Promise((resolve, reject) => {
      Records.fetchAttributeValues(attributeId, categoryId)
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
    const [keys2, values2] = this.#getCondtionsFromHierarchicConditions(keys, values);
    this.setAttributes(keys2, false);
    Records.attributes.forEach(({id}) => {
      const attribute = values2.find(attribute => attribute.attributeId === id);
      const categoryIds = [];
      if (attribute) categoryIds.push(...attribute.categoryIds);
      this.setAttributeValues(id, categoryIds, false);
    });
    this.finish(false);

    // dispatch event
    const customEvent = new CustomEvent(event.restoreParameters, {detail: {togoKey, keys, values}});
    DefaultEventEmitter.dispatchEvent(customEvent);

  }

  #clearConditinos() {
    while (this.#keyConditions.length > 0) {
      const {attributeId, parentCategoryId} = this.#keyConditions[0];
      this.removeAttribute(attributeId, parentCategoryId, false);
    };
    while (this.#valuesConditions.length > 0) {
      const {attributeId, categoryIds} = this.#valuesConditions[0];
      while (categoryIds.length > 0) {
        this.removeAttributeValue(attributeId, categoryIds[0], false);
      }
    };
    this.#postProcessing();
  }

  #getCondtionsFromHierarchicConditions(keys, values) {
    // restore conditions
    const keys2 = keys.map(({attributeId, id}) => {
      return {
        attributeId,
        parentCategoryId: id?.categoryId
      }
    });
    const values2 = values.map(({attributeId, ids}) => {
      return {
        attributeId,
        categoryIds: ids.map(id => id.categoryId)
      }
    });
    return [keys2, values2];
  }

}

export default new ConditionBuilder();
