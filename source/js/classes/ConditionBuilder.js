import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import ConditionAnnotation from "./ConditionAnnotation";
import ConditionFilter from "./ConditionFilter";
import DXCondition from "./DXCondition";
import * as event from '../events';

class ConditionBuilder {

  #conditionAnnotations; // Array<ConditionAnnotation>
  #conditionFilters; // Array<ConditionFilter>
  #togoKey;
  #userIds;
  #isRestoredConditinoFromURLParameters = false;
  #preparingCounter;

  constructor() {

    this.#conditionAnnotations = [];
    this.#conditionFilters = [];
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

  addAttribute(attributeId, parentNode, isFinal = true) {
    // store
    const conditionAnnotation = new ConditionAnnotation(attributeId, parentNode);
    this.#conditionAnnotations.push(conditionAnnotation);
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeCondition, {detail: {action: 'add', conditionAnnotation}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  addAttributeValue(attributeId, node, ancestors = [], isFinal = true) {
    // find value of same property
    const sameConditionFilter = this.#conditionFilters.find(conditionFilter => conditionFilter.attributeId === attributeId);
    // store
    if (sameConditionFilter) {
      sameConditionFilter.addCategoryId(node);
    } else {
      const conditionFilter = new ConditionFilter(attributeId, [node]);
      this.#conditionFilters.push(conditionFilter);
    }
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeValueCondition, {detail: {action: 'add', attributeId, node}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removeAttribute(attributeId, parentNode, isFinal = true) {
    // remove from store
    const index = this.#conditionAnnotations.findIndex(conditionAnnotation => conditionAnnotation.isSameCondition(attributeId, parentNode));
    if (index === -1) return;
    const conditionAnnotation = this.#conditionAnnotations.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeCondition, {detail: {action: 'remove', conditionAnnotation}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removeAttributeValue(attributeId, node, isFinal = true) {
    // remove from store
    const index = this.#conditionFilters.findIndex(conditionFilter => {
      if (conditionFilter.attributeId === attributeId) {
        conditionFilter.removeCategoryId(node);
        return conditionFilter.nodes.length === 0;
      } else {
        return false;
      }
    });
    if (index !== -1) this.#conditionFilters.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeValueCondition, {detail: {action: 'remove', attributeId, node}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  setAttributes(conditions, isFinal = true) {
    // delete existing properties
    while (this.#conditionAnnotations.length > 0) {
      this.removeAttribute(this.#conditionAnnotations[0].attributeId, this.#conditionAnnotations[0].parentNode, false);
    };
    // set new properties
    conditions.forEach(({attributeId, parentNode}) => this.addAttribute(attributeId, parentNode, false));
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
  }

  setAttributeValues(attributeId, nodes, isFinal = true) {
    const oldConditionFilter = this.#conditionFilters.find(conditionFilter => conditionFilter.attributeId === attributeId);
    if (oldConditionFilter) {
      const originalValues = Records.getAttribute(attributeId).values;
      originalValues.forEach(originalValue => {
        const indexInNew = nodes.indexOf(originalValue.node);
        const indexInOld = oldConditionFilter.nodes.indexOf(originalValue.node);
        if (indexInNew !== -1) {
          // if new value does not exist in old values, add property value
          if (indexInOld === -1) this.addAttributeValue(attributeId, originalValue.node, [], false);
        } else {
          // if extra value exists in old values, remove property value
          if (indexInOld !== -1) this.removeAttributeValue(attributeId, originalValue.node, false);
        }
      });
    } else {
      for (const node of nodes) {
        this.addAttributeValue(attributeId, node, [], false);
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
      this.#conditionAnnotations,
      this.#conditionFilters
    )});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  getSelectedCategoryIds(attributeId) {
    const nodes = {
      keys: [],
      values: []
    };
    const conditionAnnotations = this.#conditionAnnotations.filter(conditionAnnotation => conditionAnnotation.attributeId === attributeId);
    const conditionFilter = this.#conditionFilters.find(conditionFilter => conditionFilter.attributeId === attributeId);
    if (conditionAnnotations) nodes.keys.push(...conditionAnnotations.map(keyCondiiton => keyCondiiton.parentNode));
    if (conditionFilter) nodes.values.push(...conditionFilter.nodes);
    return nodes;
  }


  // public accessor

  get currentTogoKey() {
    return this.#togoKey;
  }

  get userIds() {
    return !this.#userIds ? [] : this.#userIds.split(',');
  }


  // private methods

  #postProcessing(dontLeaveInHistory = true) {
    
    if (!this.#isRestoredConditinoFromURLParameters) return;

    // evaluate if search is possible
    const established 
      = this.#togoKey
      && (this.#conditionFilters.length > 0);
    const customEvent = new CustomEvent(event.mutateEstablishConditions, {detail: established});
    DefaultEventEmitter.dispatchEvent(customEvent);

    // get hierarchic conditions
    const keys = this.#conditionAnnotations.map(keyCondiiton => keyCondiiton.getURLParameter());
    const values = this.#conditionFilters.map(conditionFilter => conditionFilter.getURLParameter());

    const __zzz__keys = keys.map(key => {
      const zzzKey = {attribute: key.attributeId};
      if (key.id) {
        zzzKey.node = key.id.node;
        if (key.id.ancestors) {
          zzzKey.path = [...key.id.ancestors];
        }
      }
      return zzzKey;
    });
    const __zzz__values = values.map(value => {
      const zzzValue = {attribute: value.attributeId};
      zzzValue.nodes = value.ids.map(id => {
        const zzzId = {node: id.node};
        if (id.ancestors) {
          zzzId.path = [...id.ancestors];
        }
        return zzzId;
      });
      return zzzValue;
    });
    
    // generate permalink
    const params = new URL(location).searchParams;
    params.set('dataset', this.#togoKey);
    params.set('annotations', JSON.stringify(__zzz__keys));
    params.set('filters', JSON.stringify(__zzz__values));
    if (dontLeaveInHistory) window.history.pushState(null, '', `${window.location.origin}${window.location.pathname}?${params.toString()}`)
  }

  #createSearchConditionFromURLParameters(isFirst = false) {

    // get conditions with ancestors
    const params = new URL(location).searchParams;
    const condition = {
      dataset: params.get('dataset'),
      annotations: JSON.parse(params.get('annotations')) ?? [],
      filters: JSON.parse(params.get('filters')) ?? [],
    }

    const __zzz__condition = {
      togoKey: condition.dataset ?? this.#togoKey,
      keys: condition.annotations.map(annotation => {
        const zzzKey = {attributeId: annotation.attribute};
        if (annotation.node) {
          zzzKey.id = {node: annotation.node};
          if (annotation.path) {
            zzzKey.id.ancestors = [...annotation.path];
          }
        }
        return zzzKey;
      }),
      values: condition.filters.map(filter => {
        const zzzValue = {
          attributeId: filter.attribute,
          ids: filter.nodes.map(node => {
            const zzzNode = {node: node.node};
            if (node.path) {
              zzzNode.ancestors = [...node.path];
            }
            return zzzNode;
          })
        };
        return zzzValue;
      })
    }
    
    if (isFirst) {
      // get child category ids
      this.#makeQueueOfGettingChildCategoryIds(__zzz__condition);
    } else {
      this.#restoreConditions(__zzz__condition);
    }

  }

  #makeQueueOfGettingChildCategoryIds(condition) {
    if (condition.togoKey) this.#togoKey = condition.togoKey;
    const queue = [];
    const addQueue = (attributeId, id) => {
      const ancestors = [id.node];
      if (id.ancestors) ancestors.push(...id.ancestors);
      ancestors.forEach(node => {
        if (queue.findIndex(task => task.attributeId === attributeId && task.node === node) === -1) {
          queue.push({attributeId, node});
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
      const {attributeId, node} = queue.shift();
      this.#getChildCategoryIds(attributeId, node)
        .then(() => this.#progressQueueOfGettingChildCategoryIds(condition, queue));
    } else {
      this.#restoreConditions(condition);
    }
  }

  #getChildCategoryIds(attributeId, node) {
    return new Promise((resolve, reject) => {
      Records.fetchAttributeValues(attributeId, node)
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
      const nodes = [];
      if (attribute) nodes.push(...attribute.nodes);
      this.setAttributeValues(id, nodes, false);
    });
    this.finish(false);

    // dispatch event
    const customEvent = new CustomEvent(event.restoreParameters, {detail: {togoKey, keys, values}});
    DefaultEventEmitter.dispatchEvent(customEvent);

  }

  #clearConditinos() {
    while (this.#conditionAnnotations.length > 0) {
      const {attributeId, parentNode} = this.#conditionAnnotations[0];
      this.removeAttribute(attributeId, parentNode, false);
    };
    while (this.#conditionFilters.length > 0) {
      const {attributeId, nodes} = this.#conditionFilters[0];
      while (nodes.length > 0) {
        this.removeAttributeValue(attributeId, nodes[0], false);
      }
    };
    this.#postProcessing();
  }

  #getCondtionsFromHierarchicConditions(keys, values) {
    // restore conditions
    const keys2 = keys.map(({attributeId, id}) => {
      return {
        attributeId,
        parentNode: id?.node
      }
    });
    const values2 = values.map(({attributeId, ids}) => {
      return {
        attributeId,
        nodes: ids.map(id => id.node)
      }
    });
    return [keys2, values2];
  }

}

export default new ConditionBuilder();
