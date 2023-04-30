import DefaultEventEmitter from './DefaultEventEmitter';
import Records from './Records';
import ConditionAnnotationUtility from './ConditionAnnotationUtility';
import ConditionFilterUtility from './ConditionFilterUtility';
import DXCondition from './DXCondition';
import * as event from '../events';
import PresetManager from './PresetManager';
import { SelectedNodes } from '../interfaces';

interface Condition {
  dataset: string;
  filters: ConditionFilterUtility[];
  annotations: ConditionAnnotationUtility[];
}
interface Task {
  attributeId: string;
  node: string;
}

class ConditionBuilder {
  #conditionUtilityAnnotations: ConditionAnnotationUtility[];
  #conditionUtilityFilters: ConditionFilterUtility[];
  #dataset: string;
  #userIds: string;
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

  setSubject(dataset: string) {
    this.#dataset = dataset;
    this.#postProcessing();
  }

  setUserIds(ids = '') {
    this.#userIds = ids.replace(/,/g, ' ').split(/\s+/).join(',');
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  addAnnotation(conditionUtilityAnnotation: ConditionAnnotationUtility, isFinal = true) {
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

  addFilter(attributeId: string, node: string, ancestors = [], isFinal = true) {
    // find filter of same property
    const sameConditionFilterUtility = this.#conditionUtilityFilters.find(
      conditionUtilityFilter =>
        conditionUtilityFilter.attributeId === attributeId
    );
    // store
    if (sameConditionFilterUtility) {
      sameConditionFilterUtility.addNode(node);
    } else {
      const conditionUtilityFilter = new ConditionFilterUtility(attributeId, [
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

  removeAnnotation(conditionUtilityAnnotation: ConditionAnnotationUtility, isFinal = true) {
    // remove from store
    const index = this.#conditionUtilityAnnotations.findIndex(
      conditionUtilityAnnotation2 =>
        conditionUtilityAnnotation2.isSameCondition(
          conditionUtilityAnnotation.attributeId,
          conditionUtilityAnnotation.parentNode || undefined
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

  removeFilter(attributeId: string, node: string, isFinal = true) {
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

  setAnnotation(annotations: ConditionAnnotationUtility[], isFinal = true) {
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

  setFilter(attributeId: string, nodes: string[], isFinal = true) {
    const oldConditionFilterUtility = this.#conditionUtilityFilters.find(
      conditionUtilityFilter =>
        conditionUtilityFilter.attributeId === attributeId
    );
    if (oldConditionFilterUtility) {
      const originalFilters = Records.getAttribute(attributeId)!.filters;
      originalFilters.forEach(originalFilter => {
        const indexInNew = nodes.indexOf(originalFilter.node);
        const indexInOld = oldConditionFilterUtility.nodes.indexOf(
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

  finish(dontLeaveInHistory: boolean): void {
    this.#postProcessing(dontLeaveInHistory);
  }

  makeQueryParameter() {
    // emmit event
    const customEvent = new CustomEvent(event.sendCondition, {
      detail: new DXCondition(
        this.#dataset,
        this.#conditionUtilityAnnotations,
        this.#conditionUtilityFilters,
        PresetManager.currentAttributeSet
      ),
    });
    DefaultEventEmitter.dispatchEvent(customEvent);
  }

  getSelectedNodes(attributeId: string): SelectedNodes {
    const nodes: SelectedNodes = {
      filters: [],
      annotations: [],
    };
    console.log(this.#conditionUtilityAnnotations)
    console.log(this.#conditionUtilityFilters)
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
    console.log(nodes)
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
      this.#conditionUtilityFilters,
      PresetManager.currentAttributeSet
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
      annotationCondiiton => annotationCondiiton.conditionAnnotationWithAncestor
    );
    const filters = this.#conditionUtilityFilters.map(
      conditionUtilityFilter =>
        conditionUtilityFilter.conditionFilterWithAncestor
    );

    // generate permalink
    const params = new URL(location.href).searchParams;
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
    const params = new URL(location.href).searchParams;
    const condition: Condition = {
      dataset: params.get('dataset') ?? this.#dataset,
      filters: ConditionFilterUtility.decodeURLSearchParams(
        params.get('filters')
      ),
      annotations: ConditionAnnotationUtility.decodeURLSearchParams(
        params.get('annotations')
      ),
    };

    if (isFirst) {
      // get child category ids
      this.#makeQueueOfGettingChildNodes(condition);
    } else {
      this.#restoreConditions(condition);
    }
  }

  #makeQueueOfGettingChildNodes(condition: Condition) {
    if (condition.dataset) this.#dataset = condition.dataset;
    const queue: Task[] = [];
    const addQueue: Function = (attributeId: string, node: string, ancestors: string[]) => {
      const ancestors2 = [node];
      if (ancestors) ancestors2.push(...ancestors);
      ancestors2.forEach(node => {
        if (
          queue.findIndex(
            (task: Task) => task.attributeId === attributeId && task.node === node
          ) === -1
        ) {
          const task: Task = {attributeId, node};
          queue.push(task);
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

  #progressQueueOfGettingChildNodes(condition: Condition, queue: Task[]) {
    if (queue.length > 0) {
      const {attributeId, node} = queue.shift()!;
      this.#getChildNodes(attributeId, node).then(() =>
        this.#progressQueueOfGettingChildNodes(condition, queue)
      );
    } else {
      this.#restoreConditions(condition);
    }
  }

  #getChildNodes(attributeId: string, node: string) {
    return new Promise<void>((resolve, reject) => {
      Records.fetchAttributeFilters(attributeId, node)
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  #restoreConditions(condition: Condition) {
    const {dataset, annotations, filters} = condition;
    this.#isRestoredConditinoFromURLParameters = true;

    // restore conditions
    this.#dataset = dataset;
    // this.#userIds = userIds;
    this.setAnnotation(annotations, false);
    Records.attributes.forEach(({id}) => {
      const attribute = filters.find(attribute => attribute.attributeId === id);
      const nodes: string[] = [];
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