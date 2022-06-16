import DefaultEventEmitter from "./DefaultEventEmitter";
import Records from "./Records";
import ConditionAnnotation from "./ConditionAnnotation";
import ConditionFilter from "./ConditionFilter";
import DXCondition from "./DXCondition";
import * as event from '../events';

class ConditionBuilder {

  #conditionAnnotations; // Array<ConditionAnnotation>
  #conditionFilters; // Array<ConditionFilter>
  #dataset;
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

  setSubject(dataset) {
    this.#dataset = dataset;
    this.#postProcessing();
  }

  setUserIds(ids = '') {
    this.#userIds = ids.replace(/,/g," ").split(/\s+/).join(',');
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  /**
   * 
   * @param {ConditionAnnotation} conditionAnnotation 
   * @param {boolean} isFinal 
   */
  addAttribute(conditionAnnotation, isFinal = true) {
    // store
    this.#conditionAnnotations.push(conditionAnnotation);
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeCondition, {detail: {action: 'add', conditionAnnotation}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  addAttributeFilter(attributeId, node, ancestors = [], isFinal = true) {
    // find filter of same property
    const sameConditionFilter = this.#conditionFilters.find(conditionFilter => conditionFilter.attributeId === attributeId);
    // store
    if (sameConditionFilter) {
      sameConditionFilter.addNode(node);
    } else {
      const conditionFilter = new ConditionFilter(attributeId, [node]);
      this.#conditionFilters.push(conditionFilter);
    }
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeFilterCondition, {detail: {action: 'add', attributeId, node}});
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

  removeAttributeFilter(attributeId, node, isFinal = true) {
    // remove from store
    const index = this.#conditionFilters.findIndex(conditionFilter => {
      if (conditionFilter.attributeId === attributeId) {
        conditionFilter.removeNode(node);
        return conditionFilter.nodes.length === 0;
      } else {
        return false;
      }
    });
    if (index !== -1) this.#conditionFilters.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAttributeFilterCondition, {detail: {action: 'remove', attributeId, node}});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  /**
   * 
   * @param {ConditionAnnotation[]} annotations
   * @param {boolean} isFinal 
   */
  setAttributes(annotations, isFinal = true) {
    // delete existing properties
    while (this.#conditionAnnotations.length > 0) {
      this.removeAttribute(this.#conditionAnnotations[0].attributeId, this.#conditionAnnotations[0].parentNode, false);
    };
    // set new properties
    annotations.forEach(conditionAnnotation => this.addAttribute(conditionAnnotation, false));
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
  }

  setAttributeFilters(attributeId, nodes, isFinal = true) {
    const oldConditionFilter = this.#conditionFilters.find(conditionFilter => conditionFilter.attributeId === attributeId);
    if (oldConditionFilter) {
      const originalFilters = Records.getAttribute(attributeId).filters;
      originalFilters.forEach(originalFilter => {
        const indexInNew = nodes.indexOf(originalFilter.node);
        const indexInOld = oldConditionFilter.nodes.indexOf(originalFilter.node);
        if (indexInNew !== -1) {
          // if new filter does not exist in old filters, add property filter
          if (indexInOld === -1) this.addAttributeFilter(attributeId, originalFilter.node, [], false);
        } else {
          // if extra filter exists in old filters, remove property filter
          if (indexInOld !== -1) this.removeAttributeFilter(attributeId, originalFilter.node, false);
        }
      });
    } else {
      for (const node of nodes) {
        this.addAttributeFilter(attributeId, node, [], false);
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
      this.#dataset,
      this.#conditionAnnotations,
      this.#conditionFilters
    )});
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  getSelectedNodes(attributeId) {
    const nodes = {
      annotations: [],
      filters: []
    };
    const conditionAnnotations = this.#conditionAnnotations.filter(conditionAnnotation => conditionAnnotation.attributeId === attributeId);
    const conditionFilter = this.#conditionFilters.find(conditionFilter => conditionFilter.attributeId === attributeId);
    if (conditionAnnotations) nodes.annotations.push(...conditionAnnotations.map(annotationCondiiton => annotationCondiiton.parentNode));
    if (conditionFilter) nodes.filters.push(...conditionFilter.nodes);
    return nodes;
  }


  // public accessor

  get currentDataset() {
    return this.#dataset;
  }

  get userIds() {
    return !this.#userIds ? [] : this.#userIds.split(',');
  }


  // private methods

  #postProcessing(dontLeaveInHistory = true) {
    
    if (!this.#isRestoredConditinoFromURLParameters) return;

    // evaluate if search is possible
    const established 
      = this.#dataset
      && (this.#conditionFilters.length > 0);
    const customEvent = new CustomEvent(event.mutateEstablishConditions, {detail: established});
    DefaultEventEmitter.dispatchEvent(customEvent);

    // get hierarchic conditions
    const annotations = this.#conditionAnnotations.map(annotationCondiiton => annotationCondiiton.getURLParameter());
    const filters = this.#conditionFilters.map(conditionFilter => conditionFilter.getURLParameter());

    // generate permalink
    const params = new URL(location).searchParams;
    params.set('dataset', this.#dataset);
    params.set('annotations', JSON.stringify(annotations));
    params.set('filters', JSON.stringify(filters));
    if (dontLeaveInHistory) window.history.pushState(null, '', `${window.location.origin}${window.location.pathname}?${params.toString()}`)
  }

  #createSearchConditionFromURLParameters(isFirst = false) {

    // get conditions with ancestors
    const params = new URL(location).searchParams;
    const condition = {
      dataset: params.get('dataset') ?? this.#dataset,
      annotations: ConditionAnnotation.decodeURLSearchParams(params.get('annotations')),
      filters: ConditionFilter.decodeURLSearchParams(params.get('filters'))
    }
    
    if (isFirst) {
      // get child category ids
      this.#makeQueueOfGettingChildNodes(condition);
    } else {
      this.#restoreConditions(condition);
    }
  }

  #makeQueueOfGettingChildNodes(condition) {
    if (condition.dataset) this.#dataset = condition.dataset;
    const queue = [];
    const addQueue = (attributeId, node, ancestors) => {
      const ancestors2 = [node];
      if (ancestors) ancestors2.push(...ancestors);
      ancestors2.forEach(node => {
        if (queue.findIndex(task => task.attributeId === attributeId && task.node === node) === -1) {
          queue.push({attributeId, node});
        }
      });
    };

    condition.annotations.forEach(annotation => {
      if (annotation.parentNode) addQueue(annotation.attributeId, annotation.parentNode, annotation.ancestors);
    });
    condition.filters.forEach(filter => {
      filter.nodes.forEach(node => {
        const ancestors = filter.getAncestors(node);
        if (ancestors.length > 0) addQueue(filter.attributeId, node, ancestors);
      });
    });

    this.#progressQueueOfGettingChildNodes(condition, queue);
  }

  #progressQueueOfGettingChildNodes(condition, queue) {
    if (queue.length > 0) {
      const {attributeId, node} = queue.shift();
      this.#getChildNodes(attributeId, node)
        .then(() => this.#progressQueueOfGettingChildNodes(condition, queue));
    } else {
      this.#restoreConditions(condition);
    }
  }

  #getChildNodes(attributeId, node) {
    return new Promise((resolve, reject) => {
      Records.fetchAttributeFilters(attributeId, node)
        .then(filters => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  #restoreConditions({dataset, userIds, annotations, filters}) {
    
    this.#isRestoredConditinoFromURLParameters = true;

    // restore conditions
    this.#dataset = dataset;
    // this.#userIds = userIds;
    this.setAttributes(annotations, false);
    Records.attributes.forEach(({id}) => {
      const attribute = filters.find(attribute => attribute.attributeId === id);
      const nodes = [];
      if (attribute) nodes.push(...attribute.nodes);
      this.setAttributeFilters(id, nodes, false);
    });
    this.finish(false);

    // dispatch event
    const customEvent = new CustomEvent(event.restoreParameters);
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
        this.removeAttributeFilter(attributeId, nodes[0], false);
      }
    };
    this.#postProcessing();
  }

}

export default new ConditionBuilder();
