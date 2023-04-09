import ConditionAnnotation from './ConditionAnnotation';
import ConditionFilter from './ConditionFilter';
import ConditionBuilder from './ConditionBuilder';
import App from './App';
import axios from 'axios';
import {getApiParameter} from '../functions/queryTemplates';

const LIMIT = 100;
let idCounter = 0;

// TODO: キャッシュの機構を作る

export default class DXCondition {
  #id;
  #togoKey;
  #conditionAnnotations;
  #conditionFilters;
  #ids;
  #properties;

  /**
   *
   * @param {string} togoKey
   * @param {ConditionAnnotation[]} conditionAnnotations
   * @param {ConditionFilter[]} conditionFilters
   */
  constructor(togoKey, conditionAnnotations, conditionFilters) {
    this.#id = idCounter++;
    this.#togoKey = togoKey;
    this.#conditionAnnotations =
      this.#copyConditionAnnotations(conditionAnnotations);
    this.#conditionFilters = this.#copyConditionFilters(conditionFilters);
    this.#properties = [];
  }

  // methods

  /**
   *
   * @param {DXCondition} dxCondition
   * @return Boolean
   */
  checkSameCondition(dxCondition) {
    // annotations
    let matchAnnotations = false;
    if (
      this.conditionAnnotations.length ===
      dxCondition.conditionAnnotations.length
    ) {
      matchAnnotations = this.conditionAnnotations.every(
        conditionAnnotation => {
          return (
            dxCondition.conditionAnnotations.findIndex(
              newConditionAnnotation => {
                return (
                  conditionAnnotation.attributeId ===
                    newConditionAnnotation.attributeId &&
                  conditionAnnotation.parentNode ===
                    newConditionAnnotation.parentNode
                );
              }
            ) !== -1
          );
        }
      );
    }
    // values
    let matchFilters = false;
    if (this.conditionFilters.length === dxCondition.conditionFilters.length) {
      matchFilters = this.conditionFilters.every(conditionFilter => {
        return (
          dxCondition.conditionFilters.findIndex(newConditionFilter => {
            return (
              conditionFilter.attributeId === newConditionFilter.attributeId &&
              conditionFilter.nodes.length ===
                newConditionFilter.nodes.length &&
              conditionFilter.nodes.every(node => {
                return (
                  newConditionFilter.nodes.findIndex(
                    newNode => node === newNode
                  ) !== -1
                );
              })
            );
          }) !== -1
        );
      });
    }
    return (
      dxCondition.togoKey === this.togoKey && matchAnnotations && matchFilters
    );
  }

  getNextProperties(limit = LIMIT) {
    console.log(this);
    return axios
      .post(
        App.getApiUrl('dataframe'),
        getApiParameter('dataframe', {
          dataset: this.togoKey,
          filters: this.queryFilters,
          annotations: this.queryAnnotations,
          queries: this.#ids.slice(this.offset, this.offset + limit),
        })
        // {cancelToken: this.#source.token}
      )
      .then(res => {
        this.#properties.push(...res.data);
        return res.data;
      });
  }

  #copyConditionAnnotations(conditionAnnotations) {
    return conditionAnnotations.map(
      conditionAnnotation =>
        new ConditionAnnotation(
          conditionAnnotation.attributeId,
          conditionAnnotation.parentNode
        )
    );
  }

  #copyConditionFilters(conditionFilters) {
    return conditionFilters.map(
      conditionFilter =>
        new ConditionFilter(conditionFilter.attributeId, [
          ...conditionFilter.nodes,
        ])
    );
  }

  // accessor

  get togoKey() {
    return this.#togoKey;
  }

  get conditionAnnotations() {
    return this.#conditionAnnotations;
  }

  get conditionFilters() {
    return this.#conditionFilters;
  }

  get queryFilters() {
    return this.#conditionFilters.map(
      conditionFilters => conditionFilters.query
    );
  }

  get queryAnnotations() {
    return this.#conditionAnnotations.map(
      conditionAnnotations => conditionAnnotations.query
    );
  }

  get offset() {
    return this.#properties.length;
  }

  get properties() {
    return [...this.#properties];
  }

  get isPropertiesLoaded() {
    return this.offset >= this.#ids?.length;
  }

  get ids() {
    // console.trace(this.#id, this.#ids ? [...this.#ids] : undefined);
    if (this.#ids) {
      return this.#ids;
    } else {
      return axios
        .post(
          App.getApiUrl('aggregate'),
          getApiParameter('aggregate', {
            dataset: this.togoKey,
            filters: this.queryFilters,
            queries: ConditionBuilder.userIds,
          })
          // {cancelToken: this.#source.token}
        )
        .then(res => {
          this.#ids = res.data;
          return res.data;
        });
    }
  }

  get tableHeader() {
    return [
      ...this.conditionFilters.map(({categoryId, attributeId}) => {
        return {categoryId, attributeId};
      }),
      ...this.conditionAnnotations.map(({categoryId, attributeId}) => {
        return {categoryId, attributeId};
      }),
    ];
  }
}
