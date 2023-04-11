import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import ConditionUtilityAnnotation from './ConditionUtilityAnnotation';
import ConditionUtilityFilter from './ConditionUtilityFilter';
import DXCondition from './DXCondition';
import * as event from '../events';

class ConditionBuilder {
  #conditionUtilityAnnotations; // Array<ConditionUtilityAnnotation>
  #conditionUtilityFilters; // Array<ConditionUtilityFilter>
  #dataset;
  #userIds;
  #isRestoredConditinoFromURLParameters = false;
  #preparingCounter;

  constructor() {
    this.#conditionUtilityAnnotations = [];
    this.#conditionUtilityFilters = [];
    this.#preparingCounter = 0;
    this.#isRestoredConditinoFromURLParameters = false;

    // event listeners
    window.addEventListener(
      'popstate',
      this.#createSearchConditionFromURLParameters.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      event.clearCondition,
      this.#clearConditinos.bind(this)
    );
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
    this.#userIds = ids.replace(/,/g, ' ').split(/\s+/).join(',');
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  /**
   *
   * @param {ConditionUtilityAnnotation} conditionUtilityAnnotation
   * @param {boolean} isFinal
   */
  addAnnotation(conditionUtilityAnnotation, isFinal = true) {
    // store
    this.#conditionUtilityAnnotations.push(conditionUtilityAnnotation);
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAnnotationCondition, {
      detail: {action: 'add', conditionUtilityAnnotation},
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  addFilter(attributeId, node, ancestors = [], isFinal = true) {
    // find filter of same property
    const sameConditionUtilityFilter = this.#conditionUtilityFilters.find(
      conditionUtilityFilter =>
        conditionUtilityFilter.attributeId === attributeId
    );
    // store
    if (sameConditionUtilityFilter) {
      sameConditionUtilityFilter.addNode(node);
    } else {
      const conditionUtilityFilter = new ConditionUtilityFilter(attributeId, [
        node,
      ]);
      this.#conditionUtilityFilters.push(conditionUtilityFilter);
    }
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateFilterCondition, {
      detail: {action: 'add', attributeId, node},
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  /**
   *
   * @param {ConditionUtilityAnnotation} conditionUtilityAnnotation
   * @param {boolean} isFinal
   * @returns
   */
  removeAnnotation(conditionUtilityAnnotation, isFinal = true) {
    // remove from store
    const index = this.#conditionUtilityAnnotations.findIndex(
      conditionUtilityAnnotation2 =>
        conditionUtilityAnnotation2.isSameCondition(
          conditionUtilityAnnotation.attributeId,
          conditionUtilityAnnotation.parentNode
        )
    );
    if (index === -1) return;
    const conditionUtilityAnnotation2 =
      this.#conditionUtilityAnnotations.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateAnnotationCondition, {
      detail: {
        action: 'remove',
        conditionUtilityAnnotation: conditionUtilityAnnotation2,
      },
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  removeFilter(attributeId, node, isFinal = true) {
    // remove from store
    const index = this.#conditionUtilityFilters.findIndex(
      conditionUtilityFilter => {
        if (conditionUtilityFilter.attributeId === attributeId) {
          conditionUtilityFilter.removeNode(node);
          return conditionUtilityFilter.nodes.length === 0;
        } else {
          return false;
        }
      }
    );
    if (index !== -1) this.#conditionUtilityFilters.splice(index, 1)[0];
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(event.mutateFilterCondition, {
      detail: {action: 'remove', attributeId, node},
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  /**
   *
   * @param {ConditionUtilityAnnotation[]} annotations
   * @param {boolean} isFinal
   */
  setAnnotation(annotations, isFinal = true) {
    // delete existing properties
    while (this.#conditionUtilityAnnotations.length > 0) {
      this.removeAnnotation(this.#conditionUtilityAnnotations[0], false);
    }
    // set new properties
    annotations.forEach(conditionUtilityAnnotation =>
      this.addAnnotation(conditionUtilityAnnotation, false)
    );
    // post processing (permalink, evaluate)
    if (isFinal) this.#postProcessing();
  }

  setFilter(attributeId, nodes, isFinal = true) {
    const oldConditionUtilityFilter = this.#conditionUtilityFilters.find(
      conditionUtilityFilter =>
        conditionUtilityFilter.attributeId === attributeId
    );
    if (oldConditionUtilityFilter) {
      const originalFilters = Records.getAttribute(attributeId).filters;
      originalFilters.forEach(originalFilter => {
        const indexInNew = nodes.indexOf(originalFilter.node);
        const indexInOld = oldConditionUtilityFilter.nodes.indexOf(
          originalFilter.node
        );
        if (indexInNew !== -1) {
          // if new filter does not exist in old filters, add property filter
          if (indexInOld === -1)
            this.addFilter(attributeId, originalFilter.node, [], false);
        } else {
          // if extra filter exists in old filters, remove property filter
          if (indexInOld !== -1)
            this.removeFilter(attributeId, originalFilter.node, false);
        }
      });
    } else {
      for (const node of nodes) {
        this.addFilter(attributeId, node, [], false);
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
    const customEvent = new CustomEvent(event.completeQueryParameter, {
      detail: new DXCondition(
        this.#dataset,
        this.#conditionUtilityAnnotations,
        this.#conditionUtilityFilters
      ),
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  getSelectedNodes(attributeId) {
    const nodes = {
      annotations: [],
      filters: [],
    };
    const conditionUtilityAnnotations =
      this.#conditionUtilityAnnotations.filter(
        conditionUtilityAnnotation =>
          conditionUtilityAnnotation.attributeId === attributeId
      );
    const conditionUtilityFilter = this.#conditionUtilityFilters.find(
      conditionUtilityFilter =>
        conditionUtilityFilter.attributeId === attributeId
    );
    if (conditionUtilityAnnotations)
      nodes.annotations.push(
        ...conditionUtilityAnnotations.map(
          annotationCondiiton => annotationCondiiton.parentNode
        )
      );
    if (conditionUtilityFilter)
      nodes.filters.push(...conditionUtilityFilter.nodes);
    return nodes;
  }

  // public accessor

  get currentDataset() {
    return this.#dataset;
  }

  get userIds() {
    return !this.#userIds ? [] : this.#userIds.split(',');
  }

  get dxCondition() {
    return new DXCondition(
      this.#dataset,
      this.#conditionUtilityAnnotations,
      this.#conditionUtilityFilters
    );
  }

  // private methods

  #postProcessing(dontLeaveInHistory = true) {
    if (!this.#isRestoredConditinoFromURLParameters) return;

    // evaluate if search is possible
    const established =
      this.#dataset && this.#conditionUtilityFilters.length > 0;
    const customEvent = new CustomEvent(event.mutateEstablishConditions, {
      detail: established,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);

    // get hierarchic conditions
    const annotations = this.#conditionUtilityAnnotations.map(
      annotationCondiiton => annotationCondiiton.getURLParameter()
    );
    const filters = this.#conditionUtilityFilters.map(conditionUtilityFilter =>
      conditionUtilityFilter.getURLParameter()
    );

    // generate permalink
    const params = new URL(location).searchParams;
    params.set('dataset', this.#dataset);
    params.set('annotations', JSON.stringify(annotations));
    params.set('filters', JSON.stringify(filters));
    if (dontLeaveInHistory)
      window.history.pushState(
        null,
        '',
        `${window.location.origin}${
          window.location.pathname
        }?${params.toString()}`
      );
  }

  #createSearchConditionFromURLParameters(isFirst = false) {
    // get conditions with ancestors
    const params = new URL(location).searchParams;
    const condition = {
      dataset: params.get('dataset') ?? this.#dataset,
      annotations: ConditionUtilityAnnotation.decodeURLSearchParams(
        params.get('annotations')
      ),
      filters: ConditionUtilityFilter.decodeURLSearchParams(
        params.get('filters')
      ),
    };

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
        if (
          queue.findIndex(
            task => task.attributeId === attributeId && task.node === node
          ) === -1
        ) {
          queue.push({attributeId, node});
        }
      });
    };

    condition.annotations.forEach(annotation => {
      if (annotation.parentNode)
        addQueue(
          annotation.attributeId,
          annotation.parentNode,
          annotation.ancestors
        );
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
      this.#getChildNodes(attributeId, node).then(() =>
        this.#progressQueueOfGettingChildNodes(condition, queue)
      );
    } else {
      this.#restoreConditions(condition);
    }
  }

  #getChildNodes(attributeId, node) {
    return new Promise((resolve, reject) => {
      Records.fetchAttributeFilters(attributeId, node)
        .then(() => {
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
    this.setAnnotation(annotations, false);
    Records.attributes.forEach(({id}) => {
      const attribute = filters.find(attribute => attribute.attributeId === id);
      const nodes = [];
      if (attribute) nodes.push(...attribute.nodes);
      this.setFilter(id, nodes, false);
    });
    this.finish(false);

    // dispatch event
    const customEvent = new CustomEvent(event.restoreParameters);
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  #clearConditinos() {
    while (this.#conditionUtilityAnnotations.length > 0) {
      this.removeAnnotation(this.#conditionUtilityAnnotations[0], false);
    }
    while (this.#conditionUtilityFilters.length > 0) {
      const {attributeId, nodes} = this.#conditionUtilityFilters[0];
      while (nodes.length > 0) {
        this.removeFilter(attributeId, nodes[0], false);
      }
    }
    this.#postProcessing();
  }
}

export default new ConditionBuilder();
