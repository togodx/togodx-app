import ConditionAnnotation from './ConditionAnnotation';
import ConditionFilter from './ConditionFilter';
import ConditionBuilder from './ConditionBuilder';
import App from './App';
import axios from 'axios';
import {getApiParameter} from '../functions/queryTemplates';
import {
  Property,
  ConditionFilterQuery,
  ConditionAnnotationQuery,
  TableHeader,
} from '../interfaces';

const LIMIT: number = 100;
let idCounter: number = 0;

// TODO: キャッシュの機構を作る

export default class DXCondition {
  #id: number;
  #togoKey: string;
  #conditionAnnotations: ConditionAnnotation[];
  #conditionFilters: ConditionFilter[];
  #ids: string[];
  #properties: Property[];

  /**
   *
   * @param {string} togoKey
   * @param {ConditionAnnotation[]} conditionAnnotations
   * @param {ConditionFilter[]} conditionFilters
   */
  constructor(
    togoKey: string,
    conditionAnnotations: ConditionAnnotation[],
    conditionFilters: ConditionFilter[]
  ) {
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
  checkSameCondition(dxCondition: DXCondition): boolean {
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

  async getNextProperties(limit: number = LIMIT): Promise<Property[]> {
    const res = await axios.post(
      App.getApiUrl('dataframe'),
      getApiParameter('dataframe', {
        dataset: this.togoKey,
        filters: this.queryFilters,
        annotations: this.queryAnnotations,
        queries: this.#ids.slice(this.offset, this.offset + limit),
      })
      // {cancelToken: this.#source.token}
    );
    const properties: Property[] = res.data;
    this.#properties.push(...properties);
    return properties;
  }

  #copyConditionAnnotations(
    conditionAnnotations: ConditionAnnotation[]
  ): ConditionAnnotation[] {
    return conditionAnnotations.map(
      conditionAnnotation =>
        new ConditionAnnotation(
          conditionAnnotation.attributeId,
          conditionAnnotation.parentNode
        )
    );
  }

  #copyConditionFilters(
    conditionFilters: ConditionFilter[]
  ): ConditionFilter[] {
    return conditionFilters.map(
      conditionFilter =>
        new ConditionFilter(conditionFilter.attributeId, [
          ...conditionFilter.nodes,
        ])
    );
  }

  // accessor

  get togoKey(): string {
    return this.#togoKey;
  }

  get conditionAnnotations(): ConditionAnnotation[] {
    return this.#conditionAnnotations;
  }

  get conditionFilters(): ConditionFilter[] {
    return this.#conditionFilters;
  }

  get queryFilters(): ConditionFilterQuery[] {
    return this.#conditionFilters.map(
      conditionFilters => conditionFilters.query
    );
  }

  get queryAnnotations(): ConditionAnnotationQuery[] {
    return this.#conditionAnnotations.map(
      conditionAnnotations => conditionAnnotations.query
    );
  }

  get offset(): number {
    return this.#properties.length;
  }

  get properties(): Property[] {
    return [...this.#properties];
  }

  get isPropertiesLoaded(): boolean {
    return this.offset >= this.#ids?.length;
  }

  get ids(): string[] | Promise<string[]> {
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

  get tableHeader(): TableHeader[] {
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
