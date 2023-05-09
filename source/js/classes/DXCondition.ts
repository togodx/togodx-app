import ConditionAnnotationUtility from './ConditionAnnotationUtility.ts';
import ConditionFilterUtility from './ConditionFilterUtility.ts';
import ConditionBuilder from './ConditionBuilder.ts';
import App from './App.ts';
import axios from 'axios';
import {getApiParameter} from '../functions/queryTemplates';
import {
  DataFrame,
  ConditionFilter,
  ConditionAnnotation,
  TableHeader,
} from '../interfaces.ts';

const LIMIT = 100;
let idCounter = 0;

// TODO: キャッシュの機構を作る

export default class DXCondition {
  #id: number;
  #togoKey: string;
  #conditionUtilityAnnotations: ConditionAnnotationUtility[];
  #conditionUtilityFilters: ConditionFilterUtility[];
  #ids: string[];
  #properties: DataFrame[];
  #attributeSet: string[];

  /**
   *
   * @param {string} togoKey
   * @param {ConditionAnnotationUtility[]} conditionUtilityAnnotations
   * @param {ConditionFilterUtility[]} conditionUtilityFilters
   */
  constructor(
    togoKey: string,
    conditionUtilityAnnotations: ConditionAnnotationUtility[],
    conditionUtilityFilters: ConditionFilterUtility[],
    attributeSet: string[]
  ) {
    this.#id = idCounter++;
    this.#togoKey = togoKey;
    this.#conditionUtilityAnnotations = this.#copyConditionAnnotationUtilitys(
      conditionUtilityAnnotations
    );
    this.#conditionUtilityFilters = this.#copyConditionFilterUtilitys(
      conditionUtilityFilters
    );
    this.#attributeSet = attributeSet;
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
              newConditionAnnotationUtility => {
                return (
                  conditionUtilityAnnotation.attributeId ===
                    newConditionAnnotationUtility.attributeId &&
                  conditionUtilityAnnotation.parentNode ===
                    newConditionAnnotationUtility.parentNode
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
              newConditionFilterUtility => {
                return (
                  conditionUtilityFilter.attributeId ===
                    newConditionFilterUtility.attributeId &&
                  conditionUtilityFilter.nodes.length ===
                    newConditionFilterUtility.nodes.length &&
                  conditionUtilityFilter.nodes.every(node => {
                    return (
                      newConditionFilterUtility.nodes.findIndex(
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

  async getIDs(): Promise<string[]> {
    if (!this.#ids) {
      const res = await axios.post(
        App.getApiUrl('aggregate'),
        getApiParameter('aggregate', {
          dataset: this.togoKey,
          filters: this.queryFilters,
          queries: ConditionBuilder.userIds,
        })
      );
      this.#ids = res.data;
    }
    return this.#ids;
  }

  async getNextProperties(limit: number = LIMIT): Promise<DataFrame[]> {
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
    const properties: DataFrame[] = res.data;
    this.#properties.push(...properties);
    return properties;
  }

  #copyConditionAnnotationUtilitys(
    conditionUtilityAnnotations: ConditionAnnotationUtility[]
  ): ConditionAnnotationUtility[] {
    return conditionUtilityAnnotations.map(
      conditionUtilityAnnotation =>
        new ConditionAnnotationUtility(
          conditionUtilityAnnotation.attributeId,
          conditionUtilityAnnotation.parentNode
        )
    );
  }

  #copyConditionFilterUtilitys(
    conditionUtilityFilters: ConditionFilterUtility[]
  ): ConditionFilterUtility[] {
    return conditionUtilityFilters.map(
      conditionUtilityFilter =>
        new ConditionFilterUtility(conditionUtilityFilter.attributeId, [
          ...conditionUtilityFilter.nodes,
        ])
    );
  }

  // accessor

  get togoKey(): string {
    return this.#togoKey;
  }

  get conditionUtilityAnnotations(): ConditionAnnotationUtility[] {
    return this.#conditionUtilityAnnotations;
  }

  get conditionUtilityFilters(): ConditionFilterUtility[] {
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

  get properties(): DataFrame[] {
    return [...this.#properties];
  }

  get isPropertiesLoaded(): boolean {
    return this.offset >= this.#ids?.length;
  }

  get ids(): string[] | undefined {
    return this.#ids;
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
