import ConditionUtilityAnnotation from './ConditionUtilityAnnotation';
import ConditionUtilityFilter from './ConditionUtilityFilter';
import ConditionBuilder from './ConditionBuilder';
import App from './App';
import axios from 'axios';
import {getApiParameter} from '../functions/queryTemplates';
import {
  Property,
  ConditionFilter,
  ConditionAnnotation,
  TableHeader,
} from '../interfaces';

const LIMIT: number = 100;
let idCounter: number = 0;

// TODO: キャッシュの機構を作る

export default class DXCondition {
  #id: number;
  #togoKey: string;
  #conditionUtilityAnnotations: ConditionUtilityAnnotation[];
  #conditionUtilityFilters: ConditionUtilityFilter[];
  #ids: string[];
  #properties: Property[];

  /**
   *
   * @param {string} togoKey
   * @param {ConditionUtilityAnnotation[]} conditionUtilityAnnotations
   * @param {ConditionUtilityFilter[]} conditionUtilityFilters
   */
  constructor(
    togoKey: string,
    conditionUtilityAnnotations: ConditionUtilityAnnotation[],
    conditionUtilityFilters: ConditionUtilityFilter[]
  ) {
    this.#id = idCounter++;
    this.#togoKey = togoKey;
    this.#conditionUtilityAnnotations = this.#copyConditionUtilityAnnotations(
      conditionUtilityAnnotations
    );
    this.#conditionUtilityFilters = this.#copyConditionUtilityFilters(
      conditionUtilityFilters
    );
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
      this.conditionUtilityAnnotations.length ===
      dxCondition.conditionUtilityAnnotations.length
    ) {
      matchAnnotations = this.conditionUtilityAnnotations.every(
        conditionUtilityAnnotation => {
          return (
            dxCondition.conditionUtilityAnnotations.findIndex(
              newConditionUtilityAnnotation => {
                return (
                  conditionUtilityAnnotation.attributeId ===
                    newConditionUtilityAnnotation.attributeId &&
                  conditionUtilityAnnotation.parentNode ===
                    newConditionUtilityAnnotation.parentNode
                );
              }
            ) !== -1
          );
        }
      );
    }
    // values
    let matchFilters = false;
    if (
      this.conditionUtilityFilters.length ===
      dxCondition.conditionUtilityFilters.length
    ) {
      matchFilters = this.conditionUtilityFilters.every(
        conditionUtilityFilter => {
          return (
            dxCondition.conditionUtilityFilters.findIndex(
              newConditionUtilityFilter => {
                return (
                  conditionUtilityFilter.attributeId ===
                    newConditionUtilityFilter.attributeId &&
                  conditionUtilityFilter.nodes.length ===
                    newConditionUtilityFilter.nodes.length &&
                  conditionUtilityFilter.nodes.every(node => {
                    return (
                      newConditionUtilityFilter.nodes.findIndex(
                        newNode => node === newNode
                      ) !== -1
                    );
                  })
                );
              }
            ) !== -1
          );
        }
      );
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

  #copyConditionUtilityAnnotations(
    conditionUtilityAnnotations: ConditionUtilityAnnotation[]
  ): ConditionUtilityAnnotation[] {
    return conditionUtilityAnnotations.map(
      conditionUtilityAnnotation =>
        new ConditionUtilityAnnotation(
          conditionUtilityAnnotation.attributeId,
          conditionUtilityAnnotation.parentNode
        )
    );
  }

  #copyConditionUtilityFilters(
    conditionUtilityFilters: ConditionUtilityFilter[]
  ): ConditionUtilityFilter[] {
    return conditionUtilityFilters.map(
      conditionUtilityFilter =>
        new ConditionUtilityFilter(conditionUtilityFilter.attributeId, [
          ...conditionUtilityFilter.nodes,
        ])
    );
  }

  // accessor

  get togoKey(): string {
    return this.#togoKey;
  }

  get conditionUtilityAnnotations(): ConditionUtilityAnnotation[] {
    return this.#conditionUtilityAnnotations;
  }

  get conditionUtilityFilters(): ConditionUtilityFilter[] {
    return this.#conditionUtilityFilters;
  }

  get queryFilters(): ConditionFilter[] {
    return this.#conditionUtilityFilters.map(
      conditionUtilityFilters => conditionUtilityFilters.query
    );
  }

  get queryAnnotations(): ConditionAnnotation[] {
    return this.#conditionUtilityAnnotations.map(
      conditionUtilityAnnotations => conditionUtilityAnnotations.query
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
      ...this.conditionUtilityFilters.map(({categoryId, attributeId}) => {
        return {categoryId, attributeId};
      }),
      ...this.conditionUtilityAnnotations.map(({categoryId, attributeId}) => {
        return {categoryId, attributeId};
      }),
    ];
  }
}
