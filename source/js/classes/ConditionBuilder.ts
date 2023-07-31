import DefaultEventEmitter from './DefaultEventEmitter.ts';
import Records from './Records.ts';
import ConditionAnnotationUtility from './ConditionAnnotationUtility.ts';
import ConditionFilterUtility from './ConditionFilterUtility.ts';
import DXCondition from './DXCondition.ts';
import PresetManager from './PresetManager.ts';
import * as events from '../events.js';
import { SelectedNodes, Preset } from '../interfaces.ts';

const IS_SAVE_CONDITION_IN_SEARCH_PARAMS = true;

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
  #userIds: string[];
  #isRestoredConditinoFromURLParameters = false;
  #preparingCounter;

  constructor() {
    this.#conditionUtilityAnnotations = [];
    this.#conditionUtilityFilters = [];
    this.#preparingCounter = 0;
    this.#isRestoredConditinoFromURLParameters = false;
    this.#dataset = '';
    this.#userIds = [];

    // event listeners
    window.addEventListener(
      'popstate',
      this.#createSearchConditionFromURLParameters.bind(this)
    );
    DefaultEventEmitter.addEventListener(
      events.clearCondition,
      this.#clearConditinos.bind(this)
    );
  }
  

  // public methods

  init() {

    const params = new URL(location.href).searchParams;

    // get preset
    const preset: string | null = params.get('preset');
    if (preset) {
      let presetUrl: URL | undefined;
      try {
        presetUrl = new URL(preset);
      } catch (e) {
        console.error(e);
      }
      if (presetUrl) this.#preset(presetUrl.href);
    }

    if (IS_SAVE_CONDITION_IN_SEARCH_PARAMS) {
      this.#createSearchConditionFromURLParameters(true);
    } else {
      // dispatch event
      const customEvent = new CustomEvent(events.restoreParameters);
      DefaultEventEmitter.dispatchEvent(customEvent);
    }
  }

  setSubject(dataset: string) {
    this.#dataset = dataset;
    this.#postProcessing();
  }

  setUserIds(ids = '') {
    this.#userIds = ids.replace(/,/g, ' ').split(/\s+/);
    // post processing (permalink, evaluate)
    this.#postProcessing();
  }

  addAnnotation(conditionUtilityAnnotation: ConditionAnnotationUtility, isFinal = true) {
    // store
    this.#conditionUtilityAnnotations.push(conditionUtilityAnnotation);
    // evaluate
    if (isFinal) this.#postProcessing();
    // dispatch event
    const customEvent = new CustomEvent(events.mutateAnnotationCondition, {
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
    const customEvent = new CustomEvent(events.mutateFilterCondition, {
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
    const customEvent = new CustomEvent(events.mutateAnnotationCondition, {
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
    const customEvent = new CustomEvent(events.mutateFilterCondition, {
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
      const attribute = Records.getAttribute(attributeId);
      if (attribute) {
        const originalNodess = attribute.nodes;
        originalNodess.forEach(originalNode => {
          const indexInNew = nodes.indexOf(originalNode.node);
          const indexInOld = oldConditionFilterUtility.nodes.indexOf(
            originalNode.node
          );
          if (indexInNew !== -1) {
            // if new filter does not exist in old filters, add property filter
            if (indexInOld === -1)
              this.addFilter(attributeId, originalNode.node, [], false);
          } else {
            // if extra filter exists in old filters, remove property filter
            if (indexInOld !== -1)
              this.removeFilter(attributeId, originalNode.node, false);
          }
        });
      }
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
    const customEvent = new CustomEvent(events.sendConditionResults, {
      detail: new DXCondition(
        this.#dataset,
        this.#userIds,
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
    // console.log(this.#conditionUtilityAnnotations)
    // console.log(this.#conditionUtilityFilters)
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
          annotationCondiiton => annotationCondiiton.parentNode!
        )
      );
    if (conditionUtilityFilter)
      nodes.filters.push(...conditionUtilityFilter.nodes);
    // console.log(nodes)
    return nodes;
  }

  // public accessor

  get currentDataset() {
    return this.#dataset;
  }

  get userIds() {
    console.log(this.#userIds)
    return this.#userIds ? [...this.#userIds] : [];
  }

  get dxCondition() {
    return new DXCondition(
      this.#dataset,
      this.#userIds,
      this.#conditionUtilityAnnotations,
      this.#conditionUtilityFilters,
      PresetManager.currentAttributeSet
    );
  }


  // private methods

  async #preset(url: string): Promise<void> {
    const presets: Preset[] = await PresetManager.loadPreset(url);
    presets.forEach(preset => {
      const customEvent = new CustomEvent(events.addConditionResults, {detail: preset});
      DefaultEventEmitter.dispatchEvent(customEvent);
    });
  }

  #postProcessing(dontLeaveInHistory = true) {

    // evaluate if search is possible
    const established =
      this.#dataset && this.#conditionUtilityFilters.length > 0;
    const customEvent = new CustomEvent(events.mutateEstablishConditions, {
      detail: established,
    });
    DefaultEventEmitter.dispatchEvent(customEvent);

    if (!this.#isRestoredConditinoFromURLParameters) return;

    if (!IS_SAVE_CONDITION_IN_SEARCH_PARAMS || !dontLeaveInHistory) return;
    const annotations = this.#conditionUtilityAnnotations.map(
      annotationCondiiton => annotationCondiiton.query
    );
    const filters = this.#conditionUtilityFilters.map(
      conditionUtilityFilter =>
        conditionUtilityFilter.query
    );
    // generate permalink
    // if (!dontLeaveInHistory) return;
    const params = new URL(location.href).searchParams;
    params.set('dataset', this.#dataset);
    params.set('annotations', JSON.stringify(annotations));
    params.set('filters', JSON.stringify(filters));
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
    console.log(condition)

    if (isFirst) {
      if (condition.dataset) this.#dataset = condition.dataset;
      // get child category ids
      // this.#makeQueueOfGettingChildNodes(condition);
      this.#restoreConditions(condition);
    } else {
      this.#restoreConditions(condition);
    }
  }

  // #makeQueueOfGettingChildNodes(condition: Condition) {
  //   if (condition.dataset) this.#dataset = condition.dataset;
  //   const queue: Task[] = [];
  //   const addQueue = (attributeId: string, node: string, ancestors: string[] | undefined) => {
  //     const ancestors2 = [node];
  //     if (ancestors) ancestors2.push(...ancestors);
  //     ancestors2.forEach(node => {
  //       if (
  //         queue.findIndex(
  //           (task: Task) => task.attributeId === attributeId && task.node === node
  //         ) === -1
  //       ) {
  //         const task: Task = {attributeId, node};
  //         queue.push(task);
  //       }
  //     });
  //   };

  //   condition.annotations.forEach(annotation => {
  //     if (annotation.parentNode)
  //       addQueue(
  //         annotation.attributeId,
  //         annotation.parentNode,
  //         annotation.ancestors
  //       );
  //   });
  //   condition.filters.forEach(filter => {
  //     filter.nodes.forEach(node => {
  //       const ancestors = filter.getAncestors(node);
  //       if (ancestors.length > 0) addQueue(filter.attributeId, node, ancestors);
  //     });
  //   });
  //   console.log(...queue)

  //   this.#progressQueueOfGettingChildNodes(condition, queue);
  // }

  // #progressQueueOfGettingChildNodes(condition: Condition, queue: Task[]) {
  //   if (queue.length > 0) {
  //     const {attributeId, node} = queue.shift() as Task;
  //     this.#getChildNodes(attributeId, node).then(() =>
  //       this.#progressQueueOfGettingChildNodes(condition, queue)
  //     );
  //   } else {
  //     this.#restoreConditions(condition);
  //   }
  // }

  // #getChildNodes(attributeId: string, node: string) {
  //   return new Promise<void>((resolve, reject) => {
  //     Records.fetchChildNodes(attributeId, node)
  //       .then(() => {
  //         resolve();
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // }

  #restoreConditions(condition: Condition) {
    console.log('#restoreConditions', condition)
    const {dataset, annotations, filters} = condition;
    console.log(dataset, annotations, filters)
    this.#isRestoredConditinoFromURLParameters = true;

    // restore conditions
    this.#dataset = dataset;
    // this.#userIds = userIds;
    this.setAnnotation(annotations, false);
    Records.attributes.forEach(({id}) => {
      const filter = filters.find(filter => filter.attributeId === id);
      const nodes: string[] = [];
      if (filter) nodes.push(...filter.nodes);
      this.setFilter(id, nodes, false);
    });
    this.finish(false);

    // dispatch event
    const customEvent = new CustomEvent(events.restoreParameters);
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
