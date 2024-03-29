import ConditionFilterUtility from './classes/ConditionFilterUtility.ts';
import ConditionAnnotationUtility from './classes/ConditionAnnotationUtility.ts';
import Color from 'colorjs.io';

// config
export interface Config {
  TEMPLATES: string;
  BACKEND: string;
  ATTRIBUTES: string;
  PRESET: string;
}
// Template
export interface Templates {
  stanzas: string[];
  templates: TemplatesTemplate[];
}
export interface TemplatesTemplate {
  [key: string]: string;
}
// API
export interface Backend {
  aggregate: {
    url: string,
  };
  dataframe: {
    url: string,
  };
  locate: {
    url: string,
  };
}
export type API = 'aggregate' | 'dataframe' | 'locate';
// Attribute
export interface Attributes {
  attributes: AttributesObject[];
  categories: AttributesCategory[];
  datasets: AttributesDatasetObject;
}
export interface AttributesObject {
  [key: string]: AttributesAttribute[];
}
export interface AttributesAttribute {
  api: string;
  datamodel: 'classification' | 'distribution';
  dataset: string;
  description: string;
  label: string;
  order: string;
  source: AttributesSource[];
}
export interface AttributesSource {
  label: string;
  updated: string;
  url: string;
  version: string;
}
export interface AttributesCategory {
  attributes: string[];
  id: string;
  label: string;
  hue: number;
  color: Color;
  colorCSSStrongValue: string;
  colorCSSValue: string;
}
export interface AttributesDatasetObject {
  [key: string]: AttributesDataset;
}
export interface AttributesDataset {
  conversion: AttributesDatasetConversion;
  examples: string[];
  label: string;
  target: boolean;
  template: string;
}
export interface AttributesDatasetConversion {
  [key: string]: string;
}

// Preset
export interface PresetMetaDatum {
  label: string;
  description: string;
  attributeSet: string[];
}
export interface Preset {
  condition?: Condition;
  attributeSet: string[];
}
// export interface Preset {
//   attribute_sets: AttributeSet[];
// }
// export interface AttributeSet {
//   label: string;
//   set: string[];
// }

// App
export interface ViewModes {
  [key: string]: boolean;
}

// dataframe responce
export interface DataFrame {
  index: {
    dataset: string,
    entry: string,
    label: string,
  };
  attributes: DataFrameAttribute[];
}
export interface DataFrameAttribute {
  id: string;
  items: DataFrameAttributeItem[];
}
export interface DataFrameAttributeItem {
  dataset: string;
  entry: string;
  node: string;
  label: string;
}

// breakdown
export interface Breakdown {
  node: string;
  label: string;
  count: number;
  tip?: boolean;
}
export interface BreakdownWithElement extends Breakdown {
  elm?: HTMLElement;
}
export interface BreakdownHierarchyRequest {
  hierarchy: '';
  node?: string;
}
export interface BreakdownHierarchyResponse {
  self: Breakdown;
  parents: Breakdown[];
  children: Breakdown[];
}

// condition

export interface ConditionFilter {
  attribute: string;
  nodes: string[];
}

export interface ConditionAnnotation {
  attribute: string;
  node?: string;
}

export interface Condition {
  dataset: string;
  filters: ConditionFilter[];
  annotations: ConditionAnnotation[];
  queries: string[];
}
export interface SelectedNodes {
  filters: string[];
  annotations: string[];
}

// table
export type TableHeader = {
  categoryId: string,
  attributeId: string,
};

// entry
export interface ShowEntryDetail {
  togoKeyView: HTMLElement;
  keys: {
    dataKey: string,
    subjectId: string,
    mainCategoryId: string,
    subCategoryId: string,
    uniqueEntryId: string,
  };
  properties: {
    dataX: string,
    dataY: string,
    dataSubOrder: string,
    isPrimaryKey: boolean,
  };
}

// display
export type Display = 'results' | 'properties';
